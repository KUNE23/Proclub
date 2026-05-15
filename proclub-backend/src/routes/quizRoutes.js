import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizByModule
} from '../controllers/quizController.js';

const router = express.Router();

router.post('/quizzes', authMiddleware, roleMiddleware(['admin']), createQuiz);
router.put('/quizzes/:id', authMiddleware, roleMiddleware(['admin']), updateQuiz);
router.delete('/quizzes/:id', authMiddleware, roleMiddleware(['admin']), deleteQuiz);

router.get('/modules/:moduleId/quizzes', authMiddleware, getQuizByModule);
router.post('/modules/:id/submit', authMiddleware, submitQuiz);

export default router;