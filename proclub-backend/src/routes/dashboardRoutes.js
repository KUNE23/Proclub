import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import {
  getDashboard,
  getCourseModulesWithProgress,
  getDashboardAnalytics
} from '../controllers/dashboardController.js'

const router = express.Router()

router.get('/dashboard', authMiddleware, getDashboard)
router.get('/courses/:courseId/modules/progress', authMiddleware, getCourseModulesWithProgress)
router.get(
  '/admin/dashboard',
  authMiddleware,
  roleMiddleware(['admin']),
  getDashboardAnalytics
)

export default router