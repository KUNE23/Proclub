import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import checkModuleAccess from '../middleware/checkModuleAccess.js';
import {
  createModule,
  getModulesByCourse,
  updateModule,
  deleteModule,
  createLesson,
  getLessonsByModule,
  getLessonDetail,
  updateLesson,
  deleteLesson,
  updateProgress,
  getQuizResults
} from '../controllers/moduleController.js';

const router = express.Router();

router.post('/courses/:courseId/modules', authMiddleware, roleMiddleware(['admin']), createModule);
router.put('/modules/:id', authMiddleware, roleMiddleware(['admin']), updateModule);
router.delete('/modules/:id', authMiddleware, roleMiddleware(['admin']), deleteModule);

router.get('/courses/:courseId/modules', authMiddleware, getModulesByCourse);

router.post('/modules/:moduleId/lessons', authMiddleware, roleMiddleware(['admin']), createLesson);
router.get('/modules/:moduleId/lessons', authMiddleware, getLessonsByModule);
router.put('/lessons/:id', authMiddleware, roleMiddleware(['admin']), updateLesson);
router.delete('/lessons/:id', authMiddleware, roleMiddleware(['admin']), deleteLesson);

router.get('/lessons/:id', authMiddleware, checkModuleAccess, getLessonDetail);
router.post('/lessons/:id/progress', authMiddleware, checkModuleAccess, updateProgress);

router.get(
  '/admin/quiz-results',
  authMiddleware,
  roleMiddleware(['admin']),
  getQuizResults
)

export default router;
