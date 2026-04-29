const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const {
  getDashboard,
  getCourseModulesWithProgress
} = require('../controllers/dashboardController')

router.get('/dashboard', authMiddleware, getDashboard)
router.get('/courses/:courseId/modules/progress', authMiddleware, getCourseModulesWithProgress)

module.exports = router