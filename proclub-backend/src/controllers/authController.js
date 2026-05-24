import prisma from '../config/prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendPasswordResetOtp } from '../services/emailService.js'
import { notifyAdmins } from '../services/adminNotificationService.js'

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'Email already used' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isActive: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

    await notifyAdmins({
      title: 'User baru mendaftar',
      message: `${user.name} mendaftar menggunakan email ${user.email} dan menunggu aktivasi akun.`,
      type: 'USER_REGISTERED',
      link: '/admin/users'
    })

    res.json({ message: 'Registrasi berhasil. Akun kamu menunggu aktivasi admin.', user })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Wrong Email or Password' });
    }

    if (user.role === 'member' && !user.email.endsWith('@student.sttcipasung.ac.id')) {
      return res.status(403).json({ message: 'Akun member wajib menggunakan email kampus.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong Email or Password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Akun kamu belum aktif. Tunggu aktivasi dari admin Proclub.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

     await prisma.user.update({
      where: { id: user.id },
      data: { token: token }
    }) 

    return res.json({
      message: 'Login success',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'Email tidak terdaftar di database.' })
    }

    const code = String(Math.floor(100000 + Math.random() * 900000))
    const codeHash = await bcrypt.hash(code, 10)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.passwordResetOtp.updateMany({
      where: {
        userId: user.id,
        consumedAt: null,
        expiresAt: { gt: new Date() }
      },
      data: { consumedAt: new Date() }
    })

    await prisma.passwordResetOtp.create({
      data: {
        email: user.email,
        codeHash,
        expiresAt,
        userId: user.id
      }
    })

    const mail = await sendPasswordResetOtp({
      email: user.email,
      name: user.name,
      code
    })

    return res.json({
      status: 'success',
      message: mail.sent ? 'Kode OTP sudah dikirim ke email kamu.' : 'Kode OTP dibuat. Konfigurasi SMTP belum tersedia di server.'
    })
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memproses reset password', error: error.message })
  }
}

export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, password } = req.body

    const resetOtp = await prisma.passwordResetOtp.findFirst({
      where: {
        email,
        consumedAt: null,
        expiresAt: { gt: new Date() }
      },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    })

    if (!resetOtp) {
      return res.status(400).json({ message: 'Kode OTP tidak valid atau sudah kedaluwarsa.' })
    }

    if (resetOtp.attempts >= 5) {
      await prisma.passwordResetOtp.update({
        where: { id: resetOtp.id },
        data: { consumedAt: new Date() }
      })

      return res.status(400).json({ message: 'Kode OTP terlalu sering dicoba. Minta kode baru.' })
    }

    const isValid = await bcrypt.compare(otp, resetOtp.codeHash)

    if (!isValid) {
      await prisma.passwordResetOtp.update({
        where: { id: resetOtp.id },
        data: { attempts: { increment: 1 } }
      })

      return res.status(400).json({ message: 'Kode OTP salah.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetOtp.userId },
        data: {
          password: hashedPassword,
          token: null
        }
      }),
      prisma.passwordResetOtp.update({
        where: { id: resetOtp.id },
        data: { consumedAt: new Date() }
      })
    ])

    return res.json({ status: 'success', message: 'Password berhasil direset. Silakan login kembali.' })
  } catch (error) {
    return res.status(500).json({ message: 'Gagal reset password', error: error.message })
  }
}

export const logout = async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { token: null }
    });
    return res.status(200).json({ 
      status: 'success',
      message: 'Logout success' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      },
      select: {
        id: true,
        name: true,
        isActive: true
      }
    })

    return res.json(user)
  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
}
