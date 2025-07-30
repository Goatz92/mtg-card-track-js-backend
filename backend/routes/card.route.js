const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card.controller');

// Scryfall routes
/**
 * @swagger
 * /api/cards/search/{name}:
 *   get:
 *     summary: Search for cards by name
 *     tags:
 *       - Cards
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Card name to search
 *     responses:
 *       200:
 *         description: List of matching cards
 */
router.get('/search/:name', cardController.searchCardScryfall);
router.post('/scryfall/:scryfallId', cardController.addCardFromScryfall); 
router.post('/scryfall/name/:cardName', cardController.addCardFromScryfallByName);

//MTG API routes
// router.get('/search/:name', getCardFromAPI); // Get card by name from API

// Random card route
/**
 * @swagger
 * /api/cards/random:
 *   get:
 *     summary: Get a random card
 *     tags:
 *       - Cards
 *     responses:
 *       200:
 *         description: Random card data
 */
router.get('/random', cardController.getRandomCard);

//Local DB operations
router.get('/', cardController.getAllCards);
router.get('/:name', cardController.getCardByName); 

//Collection Managment
router.put('/:id', cardController.updateCard); 
router.delete('collection/:id', cardController.deleteCard); 

module.exports = router;
