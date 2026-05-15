import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import {
  getDashboard,
  getCourseModulesWithProgress
} from '../controllers/dashboardController.js'

const router = express.Router()

router.get('/dashboard', authMiddleware, getDashboard)
router.get('/courses/:courseId/modules/progress', authMiddleware, getCourseModulesWithProgress)

export default router