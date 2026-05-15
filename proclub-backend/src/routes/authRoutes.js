import express from 'express'
import { validate } from '../middleware/validate.js'
import { register, login, logout } from '../controllers/authController.js'
import { registerSchema, loginSchema } from '../schema/authSchema.js'
import authMiddleware from '../middleware/authMiddleware.js'
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()
router.post('/login', loginLimiter, validate(loginSchema), login)
router.post('/logout', authMiddleware, logout)
router.post('/register', registerLimiter, validate(registerSchema), register)

export default router