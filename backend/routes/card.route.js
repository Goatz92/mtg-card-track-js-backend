const express = require('express');
const router = express.Router();
const { 
    getAllCards,
    getCardByName,
    addToCollection,
    updateCard,
    deleteCard,
} = require('../controllers/card.controller');

router.get('/', getAllCards); // Get all cards
router.get('/:name', getCardByName); // Get card by name
router.post('/', addToCollection); // Add card to collection
router.put('/:id', updateCard); // Update card in collection
router.delete('/:id', deleteCard); // Delete card from collection

module.exports = router;
