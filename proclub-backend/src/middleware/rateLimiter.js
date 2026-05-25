import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  message: {
    status: 'fail',
    message: 'Too many login attempts, please try again after 15 minutes'
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

const registerLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, 
  max: 3, 
  message: { message: "Batas pembuatan akun tercapai, coba lagi nanti." }
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: 'fail',
    message: 'Terlalu banyak permintaan OTP. Silakan coba lagi nanti.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    status: 'fail',
    message: 'Terlalu banyak percobaan reset password. Silakan coba lagi nanti.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: 'fail',
    message: 'Terlalu banyak pesan dikirim. Silakan coba lagi nanti.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export { loginLimiter, registerLimiter, forgotPasswordLimiter, resetPasswordLimiter, contactLimiter };
