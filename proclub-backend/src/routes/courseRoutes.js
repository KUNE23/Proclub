import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import { upload } from '../middleware/uploadMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createCourseSchema, updateCourseSchema } from '../schema/courseSchema.js'
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} from '../controllers/courseController.js'

const router = express.Router()

router.post(
  '/courses',
  authMiddleware,
  roleMiddleware(['admin']),
  upload.single('image'),
  validate(createCourseSchema),
  createCourse
)
router.get('/courses', authMiddleware, getCourses)
router.get('/courses/:id', authMiddleware, getCourseById)
router.put(
  '/courses/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  upload.single('image'),
  validate(updateCourseSchema),
  updateCourse
)
router.delete('/courses/:id', authMiddleware, roleMiddleware(['admin']), deleteCourse)

export default router 