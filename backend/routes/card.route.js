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

// Scryfall routes
router.get('/search/:name', searchCardScryfall) // Search for single card in Scryfall
router.post('/scryfall/:scryfallId', addCardFromScryfall); // Add a card from Scryfall to collection

//MTG API routes
// router.get('/search/:name', getCardFromAPI); // Get card by name from API

//Local DB operations
router.get('/', getAllCards); // Get all cards
router.get('/:name', getCardByName); // Get card by name from collection

//Collection Managment
router.put('/:id', updateCard); // Update card in collection
router.delete('collection/:id', deleteCard); // Delete card from collection

module.exports = router;
