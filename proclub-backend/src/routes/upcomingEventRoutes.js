import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import {
  createUpcomingEvent,
  deleteUpcomingEvent,
  getNearestUpcomingEvent,
  getUpcomingEvents,
  updateUpcomingEvent
} from '../controllers/upcomingEventController.js'

const router = express.Router()

router.get('/upcoming-events/nearest', authMiddleware, getNearestUpcomingEvent)
router.get('/admin/upcoming-events', authMiddleware, roleMiddleware(['admin']), getUpcomingEvents)
router.post('/admin/upcoming-events', authMiddleware, roleMiddleware(['admin']), createUpcomingEvent)
router.put('/admin/upcoming-events/:id', authMiddleware, roleMiddleware(['admin']), updateUpcomingEvent)
router.delete('/admin/upcoming-events/:id', authMiddleware, roleMiddleware(['admin']), deleteUpcomingEvent)

export default router
