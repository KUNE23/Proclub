import express from 'express'
import { validate } from '../middleware/validate.js'
import { register, login, logout, getMe, requestPasswordReset, resetPasswordWithOtp } from '../controllers/authController.js'
import { registerSchema, loginSchema, requestPasswordResetSchema, resetPasswordSchema } from '../schema/authSchema.js'
import authMiddleware from '../middleware/authMiddleware.js'
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()
router.post('/login', loginLimiter, validate(loginSchema), login)
router.post('/forgot-password', validate(requestPasswordResetSchema), requestPasswordReset)
router.post('/reset-password', validate(resetPasswordSchema), resetPasswordWithOtp)
router.post('/logout', authMiddleware, logout)
router.post('/register', registerLimiter, validate(registerSchema), register)
router.get('/me', authMiddleware, getMe)

export default router
