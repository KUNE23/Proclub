import express from 'express'
import { validate } from '../middleware/validate.js'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import { submitProjectSchema } from '../schema/projectSchema.js'
import {
  submitProject,
  getUserProjects,
  reviewProject
} from '../controllers/projectController.js'

const router = express.Router()

router.post('/projects', authMiddleware, validate(submitProjectSchema), submitProject)
router.get('/projects', authMiddleware, getUserProjects)
router.put('/projects/:id/review', authMiddleware, roleMiddleware(['admin', 'mentor']), reviewProject)

export default router
