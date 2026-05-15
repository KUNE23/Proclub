    import express from 'express'
    import authMiddleware from '../middleware/authMiddleware.js'
import {
  getMemberDashboard
} from '../controllers/memberDashboardController.js'

const router = express.Router()

router.get(
  '/member/dashboard',
  authMiddleware,
  getMemberDashboard
)

export default router