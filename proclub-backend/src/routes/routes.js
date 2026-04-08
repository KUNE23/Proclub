const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const {
  getDashboard,
  getCourseModulesWithProgress
} = require('../controllers/dashboardController')

router.get('/', authMiddleware, getDashboard)
router.get('/courses/:courseId/modules', authMiddleware, getCourseModulesWithProgress)

module.exports = router
