import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {
  getDashboard,
  getCourseModulesWithProgress
} from '../controllers/dashboardController.js'

const router = express.Router()

router.get('/', authMiddleware, getDashboard)
router.get('/courses/:courseId/modules', authMiddleware, getCourseModulesWithProgress)

export default router
