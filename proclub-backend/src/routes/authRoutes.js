const express = require('express')
const router = express.Router()
const { validate } = require('../middleware/validate')
const { register, login, logout } = require('../controllers/authController')
const { registerSchema, loginSchema } = require('../schema/authSchema')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/logout', authMiddleware, logout)

module.exports = router