const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card.controller');

// Scryfall routes
router.get('/search/:name', cardController.searchCardScryfall);
router.post('/scryfall/:scryfallId', cardController.addCardFromScryfall); 
router.post('/scryfall/name/:cardName', cardController.addCardFromScryfallByName);

//MTG API routes
// router.get('/search/:name', getCardFromAPI); // Get card by name from API

//Local DB operations
router.get('/', cardController.getAllCards);
router.get('/:name', cardController.getCardByName); 

//Collection Managment
router.put('/:id', cardController.updateCard); 
router.delete('collection/:id', cardController.deleteCard); 

module.exports = router;
