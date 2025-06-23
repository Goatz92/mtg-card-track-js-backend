const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller')
const verifyToken = require('../middleware/auth.middleware').verifyToken
const verifyRoles = require('../middleware/auth.middleware').verifyRoles;

// Public routes
router.post('/register', userController.create);
router.get('/check-email/:email', userController.checkDuplicateEmail);

// Protected routes - require authentication
router.get('/', verifyToken, userController.findAll);
router.get('/:username', verifyToken, userController.findOne);

// Admin only routes
router.patch('/:username', verifyToken, verifyRoles('ADMIN'), userController.update);
router.delete('/:username', verifyToken, verifyRoles('ADMIN'), userController.deleteByUsername);

module.exports = router;