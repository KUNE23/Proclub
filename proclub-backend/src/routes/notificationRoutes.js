import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from '../controllers/notificationController.js'

const router = express.Router()

router.get('/notifications', authMiddleware, getNotifications)
router.patch('/notifications/read-all', authMiddleware, markAllNotificationsAsRead)
router.patch('/notifications/:id/read', authMiddleware, markNotificationAsRead)

export default router
