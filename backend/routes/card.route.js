const express = require('express');
const router = express.Router();
const { 
    getAllCards,
    getCardByName,
    addToCollection,
    updateCard,
    deleteCard,
    getCardFromAPI
} = require('../controllers/card.controller');

router.get('/', getAllCards); // Get all cards
router.get('/:name', getCardByName); // Get card by name from DB
router.post('/', addToCollection); // Add card to collection
router.put('/:id', updateCard); // Update card in collection
router.delete('/:id', deleteCard); // Delete card from collection

// MTG API Routes
router.get('/search/:name', getCardFromAPI); // Get card by name from API

module.exports = router;
