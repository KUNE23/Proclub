const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController')

router.post('/courses', authMiddleware, roleMiddleware(['admin']), createCourse)
router.get('/courses', getCourses)
router.get('/courses/:id', getCourseById)
router.put('/courses/:id', authMiddleware, roleMiddleware(['admin']), updateCourse)
router.delete('/courses/:id', authMiddleware, roleMiddleware(['admin']), deleteCourse)

module.exports = router 