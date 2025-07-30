const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const userCardController = require('../controllers/user.card.controller');
const verifyToken = require('../middleware/auth.middleware').verifyToken
const verifyRoles = require('../middleware/auth.middleware').verifyRoles;

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Username or email already exists
 */
router.post('/register', userController.create);
router.get('/check-email/:email', userController.checkDuplicateEmail);

// Protected routes - require authentication
router.get('/', verifyToken, userController.findAll);
router.get('/:username', verifyToken, userController.findOne);

// Admin only routes
router.patch('/:username', verifyToken, verifyRoles('ADMIN'), userController.update);
router.delete('/:username', verifyToken, verifyRoles('ADMIN'), userController.deleteByUsername);

//User collection handling routes
router.get('/:username/collection', userCardController.getUserCollection);
router.post('/:username/collection/', userCardController.addToCollection);
router.post('/:username/collection/:scryfallId', userCardController.addToCollection)

module.exports = router;