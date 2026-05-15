import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validate.js';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { createCategorySchema, updateCategorySchema } from '../schema/categorySchema.js';

const router = express.Router();

router.get('/categories', authMiddleware, getCategories);

router.put('/categories/:id', authMiddleware, roleMiddleware(['admin']), validate(updateCategorySchema), updateCategory);

router.post('/categories', authMiddleware, roleMiddleware(['admin']), validate(createCategorySchema), createCategory);


export default router;