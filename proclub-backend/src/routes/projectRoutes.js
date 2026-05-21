import express from 'express'
import { validate } from '../middleware/validate.js'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import { submitProjectSchema } from '../schema/projectSchema.js'
import { projectRequirementSchema } from '../schema/projectSchema.js'
import {
  submitProject,
  getAdminProjects,
  getProjectRequirements,
  createProjectRequirement,
  updateProjectRequirement,
  deleteProjectRequirement,
  getUserProjects,
  reviewProject
} from '../controllers/projectController.js'

const router = express.Router()

router.post('/projects', authMiddleware, validate(submitProjectSchema), submitProject)
router.get('/admin/projects', authMiddleware, roleMiddleware(['admin', 'mentor']), getAdminProjects)
router.get('/courses/:courseId/project-requirements', authMiddleware, getProjectRequirements)
router.post('/courses/:courseId/project-requirements', authMiddleware, roleMiddleware(['admin', 'mentor']), validate(projectRequirementSchema), createProjectRequirement)
router.put('/project-requirements/:id', authMiddleware, roleMiddleware(['admin', 'mentor']), validate(projectRequirementSchema), updateProjectRequirement)
router.delete('/project-requirements/:id', authMiddleware, roleMiddleware(['admin', 'mentor']), deleteProjectRequirement)
router.get('/projects', authMiddleware, getUserProjects)
router.put('/projects/:id/review', authMiddleware, roleMiddleware(['admin', 'mentor']), reviewProject)

export default router
