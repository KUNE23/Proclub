import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema, updateUserSchema, updateProfileSchema } from '../schema/userSchema.js';
import { getProfile, createUser, getUsers, getUserById, updateUser, deleteUser, updateProfile, getAllUserProgress, getMyProgress } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, validate(updateProfileSchema), updateProfile);

router.post('/', authMiddleware, roleMiddleware(['admin']), validate(createUserSchema), createUser);
router.get('/', authMiddleware, roleMiddleware(['admin']), getUsers);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), validate(updateUserSchema), updateUser);
router.get('/:id', authMiddleware, roleMiddleware(['admin']), getUserById);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);
router.get('/user/progress', authMiddleware, getMyProgress)

router.get('/admin/user-progress', authMiddleware, roleMiddleware(['admin']), getAllUserProgress);
export default router;