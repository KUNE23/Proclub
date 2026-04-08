const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const {
  createModule,
  getModulesByCourse,
  updateModule,
  deleteModule
} = require('../controllers/moduleController')

router.post('/courses/:courseId/modules', authMiddleware, roleMiddleware(['admin']), createModule)
router.get('/courses/:courseId/modules', getModulesByCourse)
router.put('/modules/:id', authMiddleware, roleMiddleware(['admin']), updateModule)
router.delete('/modules/:id', authMiddleware, roleMiddleware(['admin']), deleteModule)

module.exports = router