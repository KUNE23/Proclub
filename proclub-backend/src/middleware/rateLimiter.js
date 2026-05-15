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


export { loginLimiter, registerLimiter };