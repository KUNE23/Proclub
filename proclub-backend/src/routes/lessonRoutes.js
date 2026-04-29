const express = require('express')
const router = express.Router()
const {
  createLesson,
  getLessonsByModule,
  getLessonById,
  updateLesson,
  deleteLesson
} = require('../controllers/lessonController')

router.post('/:moduleId', createLesson)

router.get('/module/:moduleId', getLessonsByModule)

router.get('/:id', getLessonById)

router.put('/:id', updateLesson)

router.delete('/:id', deleteLesson)

module.exports = router
