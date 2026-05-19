import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizByLesson
} from '../controllers/quizController.js';

const router = express.Router();

router.post('/quizzes', authMiddleware, roleMiddleware(['admin']), createQuiz);
router.put('/quizzes/:id', authMiddleware, roleMiddleware(['admin']), updateQuiz);
router.delete('/quizzes/:id', authMiddleware, roleMiddleware(['admin']), deleteQuiz);

router.get('/lessons/:lessonId/quizzes', authMiddleware, getQuizByLesson);
router.post('/lessons/:id/submit', authMiddleware, submitQuiz);

export default router;
