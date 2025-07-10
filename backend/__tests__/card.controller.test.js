const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const cardController = require('../controllers/card.controller');
const cardService = require('../services/card.service');

require('dotenv').config({ path: '.env.test' });

// Mock logger, connect, and disconnect methods to avoid actual database connections during tests
jest.mock('../logger/logger', () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        warn: jest.fn(),
    },
    addMongoDBTransport: jest.fn()
}));

mongoose.connect = jest.fn();
mongoose.disconnect = jest.fn();

const app = require('../app');
app.use(express.json());

app.post('/api/cards/scryfall/:scryfallId', cardController.addCardFromScryfall);


describe("Requests for /api/cards", () => {

    describe("POST /api/cards/scryfall/:scryfallId", () => {
        it("should add a card from Scryfall", async () => {
            const mockCard = {
                name: 'Lightning Bolt',
                scryfallId: 'test_scryfall_id'
            };
            jest.spyOn(cardService, 'addCardFromScryfall').mockResolvedValue(mockCard);

            const response = await request(app)
                .post('/api/cards/scryfall/test_scryfall_id')
                .send({
                    userData: 'test_user_data'
                });

            expect(response.statusCode).toBe(201);
            expect(response.body.data.name).toBe(mockCard.name);
            expect(response.body.data.scryfallId).toBe(mockCard.scryfallId);
        }, 50000);

        it('should return 500 Internal Server Error on failure', async () => {
            jest.spyOn(cardService, 'addCardFromScryfall').mockRejectedValue(new Error('Test error'));

            const response = await request(app)
                .post('/api/cards/scryfall/test_scryfall_id')
                .send({
                    userData: 'test_user_data'
                });

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('Error adding card');
        }, 50000);
    });
});