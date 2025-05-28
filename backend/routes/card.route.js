const express = require('express');
const router = express.Router();
const { 
    getAllCards,
    getCardByName,
    updateCard,
    deleteCard,
    searchCardScryfall,
    addCardFromScryfall
} = require('../controllers/card.controller');
const { addCardFromScryfallByName } = require('../services/card.service');

// Scryfall routes
router.get('/search/:name', searchCardScryfall);
router.post('/scryfall/:scryfallId', addCardFromScryfall); 
router.post('/scryfall/:name', addCardFromScryfallByName);

//MTG API routes
// router.get('/search/:name', getCardFromAPI); // Get card by name from API

//Local DB operations
router.get('/', getAllCards);
router.get('/:name', getCardByName); 

//Collection Managment
router.put('/:id', updateCard); 
router.delete('collection/:id', deleteCard); 

module.exports = router;
