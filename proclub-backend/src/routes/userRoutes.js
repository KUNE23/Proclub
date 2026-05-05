const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validate');
const { createUserSchema, updateUserSchema, updateProfileSchema } = require('../schema/userSchema');
const { getProfile, createUser, getUsers, getUserById, updateUser, deleteUser, updateProfile } = require('../controllers/userController');

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, validate(updateProfileSchema), updateProfile);

router.post('/', authMiddleware, roleMiddleware(['admin']), validate(createUserSchema), createUser);
router.get('/', authMiddleware, roleMiddleware(['admin']), getUsers);
router.get('/:id', authMiddleware, roleMiddleware(['admin']), getUserById);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), validate(updateUserSchema), updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);

module.exports = router;