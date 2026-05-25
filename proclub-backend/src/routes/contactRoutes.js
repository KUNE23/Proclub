import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import { validate } from '../middleware/validate.js'
import { contactLimiter } from '../middleware/rateLimiter.js'
import { contactMessageSchema, updateContactMessageSchema } from '../schema/contactSchema.js'
import {
  createContactMessage,
  deleteContactMessage,
  getContactMessages,
  updateContactMessage
} from '../controllers/contactController.js'

const router = express.Router()

router.post('/contacts', contactLimiter, validate(contactMessageSchema), createContactMessage)
router.get('/admin/contacts', authMiddleware, roleMiddleware(['admin']), getContactMessages)
router.patch('/admin/contacts/:id', authMiddleware, roleMiddleware(['admin']), validate(updateContactMessageSchema), updateContactMessage)
router.delete('/admin/contacts/:id', authMiddleware, roleMiddleware(['admin']), deleteContactMessage)

export default router
