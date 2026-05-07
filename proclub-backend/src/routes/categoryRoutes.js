const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validate');
const { getCategories, createCategory, updateCategory } = require('../controllers/categoryController');
const { createCategorySchema, updateCategorySchema } = require('../schema/categorySchema');

router.get('/categories', authMiddleware, getCategories);

router.put('/categories/:id', authMiddleware, roleMiddleware(['admin']), validate(updateCategorySchema), updateCategory);

router.post('/categories', authMiddleware, roleMiddleware(['admin']), validate(createCategorySchema), createCategory);


module.exports = router;