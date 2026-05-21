import nodemailer from 'nodemailer'

const hasSmtpConfig = () => {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS)
}

const createTransporter = () => {
  if (!hasSmtpConfig()) return null

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

export const sendPasswordResetOtp = async ({ email, name, code }) => {
  const transporter = createTransporter()

  if (!transporter) {
    console.info(`Password reset OTP untuk ${email}: ${code}`)
    return { sent: false }
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Kode OTP Reset Password Proclub',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1A2E20;">
        <h2>Reset Password Proclub</h2>
        <p>Halo ${name || 'Member Proclub'},</p>
        <p>Gunakan kode OTP berikut untuk reset password akun kamu:</p>
        <div style="font-size: 28px; font-weight: 800; letter-spacing: 6px; background: #F2F7F4; padding: 16px 20px; display: inline-block; border-radius: 12px;">${code}</div>
        <p>Kode ini berlaku selama 10 menit. Abaikan email ini jika kamu tidak meminta reset password.</p>
      </div>
    `
  })

  return { sent: true }
}
