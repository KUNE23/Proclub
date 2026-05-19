import prisma from '../config/prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    const { name, email, password} = req.body

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
        password: hashedPassword
      }
    })

    res.json({ message: 'Register success', user })
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

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong Email or Password' });
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
        role: user.role 
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await prisma.user.findUnique({
      where: { email }
    })
d
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    res.json({ message: 'Password reset link sent to your email' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }d
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
        name: true
      }
    })

    return res.json(user)
  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
}