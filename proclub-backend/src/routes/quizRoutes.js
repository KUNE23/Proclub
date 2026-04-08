const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const {
  createQuiz,
  updateQuiz,
  deleteQuiz
} = require('../controllers/quizController')

router.post('/quizzes', authMiddleware, roleMiddleware(['admin']), createQuiz)
router.put('/quizzes/:id', authMiddleware, roleMiddleware(['admin']), updateQuiz)
router.delete('/quizzes/:id', authMiddleware, roleMiddleware(['admin']), deleteQuiz)

module.exports = router