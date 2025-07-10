const authController = require('../controllers/auth.controller');
const request = require('supertest');
const express = require('express');
const authService = require('../services/auth.service');
const User = require('../models/user.model'); 
const bcrypt = require('bcrypt');

jest.mock('../models/user.model');

describe('Auth Controller', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        // Set up the route for login
        app.post('/login', authController.login);
    });

    describe('POST /login', () => {
        it('should return 200 OK on successful login', async () => {

            const hashedPassword = await bcrypt.hash('testpassword', 10);

            const mockUser = {
                username: 'testuser',
                password: hashedPassword
            };
            jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

            const mockToken = 'test_token';
            jest.spyOn(authService, 'generateAccessToken').mockReturnValue(mockToken);

            const response = await request(app)
                .post('/login')
                .send({
                    username: 'testuser',
                    password: 'testpassword'
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.token).toBe(mockToken);
        });

        it('should return 401 Unauthorized on invalid credentials', async () => {
            jest.spyOn(authService, 'generateAccessToken').mockRejectedValue(new Error('Invalid credentials'));

            const response = await request(app)
                .post('/login')
                .send({
                    username: 'testuser',
                    password: 'wrongpassword'
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Invalid credentials');
        });
    });
});