import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import checkModuleAccess from '../middleware/checkModuleAccess.js';
import {
  createModule,
  getModulesByCourse,
  updateModule,
  deleteModule,
  getModuleDetail,
  updateProgress
} from '../controllers/moduleController.js';

const router = express.Router();

router.post('/courses/:courseId/modules', authMiddleware, roleMiddleware(['admin']), createModule);
router.put('/modules/:id', authMiddleware, roleMiddleware(['admin']), updateModule);
router.delete('/modules/:id', authMiddleware, roleMiddleware(['admin']), deleteModule);

router.get('/courses/:courseId/modules', getModulesByCourse);

router.get('/courses/:courseId/modules/:id', authMiddleware, checkModuleAccess, getModuleDetail);

router.get('/modules/:id', authMiddleware, checkModuleAccess, getModuleDetail);
router.post('/modules/:id/progress', authMiddleware, updateProgress);

export default router;