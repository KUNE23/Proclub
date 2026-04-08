const express = require('express')
const router = express.Router()
const { validate } = require('../middleware/validate')
const { register, login, logout } = require('../controllers/authController')
const { registerSchema, loginSchema } = require('../schema/authSchema')
const authMiddleware = require('../middleware/authMiddleware')
const { loginLimiter } = require('../middleware/rateLimiter')
const { registerLimiter } = require('../middleware/rateLimiter')

router.post('/register', registerLimiter, validate(registerSchema), register)
router.post('/login', loginLimiter, validate(loginSchema), login)
router.post('/logout', authMiddleware, logout)

module.exports = router