const express = require('express')
const router = express.Router()
const { validate } = require('../middleware/validate')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const { submitProjectSchema } = require('../schema/projectSchema')
const {
  submitProject,
  getUserProjects,
  reviewProject
} = require('../controllers/projectController')

router.post('/projects', authMiddleware, validate(submitProjectSchema), submitProject)
router.get('/projects', authMiddleware, getUserProjects)
router.put('/projects/:id/review', authMiddleware, roleMiddleware(['admin', 'mentor']), reviewProject)

module.exports = router
