const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const checkModuleAccess = require('../middleware/checkModuleAccess')
const {
  createModule,
  getModulesByCourse,
  updateModule,
  deleteModule,
  updateProgress,
  getModuleDetail
} = require('../controllers/moduleController')

router.post('/courses/:courseId/modules', authMiddleware, roleMiddleware(['admin']), createModule)
router.get('/courses/:courseId/modules', getModulesByCourse)
router.get('/courses/:courseId/modules/:moduleId', authMiddleware, checkModuleAccess, getModuleDetail)
router.post('/modules/:id/complete', authMiddleware, updateProgress)
router.put('/modules/:id', authMiddleware, roleMiddleware(['admin']), updateModule)
router.delete('/modules/:id', authMiddleware, roleMiddleware(['admin']), deleteModule)

module.exports = router