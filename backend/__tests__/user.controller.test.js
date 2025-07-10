const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const userController = require('../controllers/user.controller');
const User = require('../models/user.model');

require('dotenv').config({ path: '.env.test' });

const app = express();
app.use(express.json());

app.post('/api/users/register', userController.create);

jest.mock('../logger/logger', () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        warn: jest.fn(),
    },
    addMongoDBTransport: jest.fn()
}));

// Mock the User model
jest.mock('../models/user.model', () => {
    return {
        create: jest.fn().mockImplementation((user) => {
            console.log('Mock User.create called with:', user);
            return {
                ...user,
                save: jest.fn().mockResolvedValue(user)
            };
        }),
        save: jest.fn()
    };
});

mongoose.connect = jest.fn();
mongoose.disconnect = jest.fn();

describe("Requests for /api/users", () => {
    
    describe("POST / api/users/register", () => {
        it("should register a new user", async () => {
            const mockUser = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'testpassword'
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(mockUser);

            console.log('Response status:', response.statusCode);
            console.log('Response body:', response.body);

            expect(response.statusCode).toBe(201);
            expect(response.body.status).toBe(true);
            expect(response.body.data.username).toBe(mockUser.username);
            expect(response.body.data.email).toBe(mockUser.email);
        }), 50000;

        it("should return 400 Bad Request on missing fields", async () => {
            const invalidUser = {
                email: 'test@example.com',
            }

            const response = await request(app)
                .post('/api/users/register')
                .send(invalidUser);

            console.log('Response status:', response.statusCode);
            console.log('Response body:', response.body);

            expect(response.statusCode).toBe(400);
            expect(response.body.status).toBe(false);
        }), 50000;
    });
});