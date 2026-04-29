const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const { upload } = require('../middleware/uploadMiddleware')
const { validate } = require('../middleware/validate')
const { createCourseSchema, updateCourseSchema } = require('../schema/courseSchema')
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController')

router.post(
  '/courses',
  authMiddleware,
  roleMiddleware(['admin']),
  upload.single('image'),
  validate(createCourseSchema),
  createCourse
)
router.get('/courses', getCourses)
router.get('/courses/:id', getCourseById)
router.put(
  '/courses/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  upload.single('image'),
  validate(updateCourseSchema),
  updateCourse
)
router.delete('/courses/:id', authMiddleware, roleMiddleware(['admin']), deleteCourse)

module.exports = router 