const CardService = require('/services/card.service');
const logger = require ('logger/logger');

// @desc    Search for cards in MTG API by name
// @route   GET /api/cards/search/:name
// @access  Public
const getCardFromAPI = async (req, res) => {
    try {
        const cards = await CardService.searchMTGAPI(req.params.name);
        if (!cards) {
            return res.status(404).json({ message: 'No cards Found'});
        }
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cards', error: error.message});
    }
} 

// @desc    Get all cards
// @route   GET /api/cards
// @access  Public
const getAllCards = async (req, res) => {
    try {
        const cards = await CardService.findAll();
        logger.debug(`Found ${cards.length} cards`);
        res.status(200).json(cards);
    } catch(error) {
        logger.error('Error fetching Cards', { error: error.message });
        res.status(500).json({ message: 'Error fetcing cards', error: error.message});
    }
}

// @desc    Get single card by Name 
// @route   GET /api/cards/:name
// @access  Public
const getCardByName = async (req, res) => {
    try {
        const decodedName = decodeURIComponent(req.params.name);
        const card = await CardService.findByName(decodedName);

        if(!card) {
            return res.status(404).json({ message: 'Card not found'});
        }
        res.status(200).json(card);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching card', error: error.message});
    }
}

// @desc    Add a card to user's collection
// @route   POST /api/collection
// @access  Public
const addToCollection = async (req, res) => {
    try {
        const savedCard = await CardService.addCard(req.body);
        res.status(201).json(savedCard);
    } catch (error) {
        logger.error('Error adding card', { error: error.message});
        res.status(500).json({
            message: 'Error adding card to collection',
            error: error.message
        });
    }
}

// @desc    Update a card in user's collection
// @route   PUT /api/collection/:id
// @access  Public
const updateCard = async (req, res) => {
    try {
        const updatedCard = await CardService.updateCard(req.params.id, req.body.quantity);
        if(!updatedCard) {
            return res.status(404).json({ message: 'Card not found'});
        }
        res.status(200).json(updatedCard);
    } catch (error) {
        res.status(500).json({ message: 'Error updating card', error: error.message});
    }
}

// @desc    Remove a card from user's collection
// @route   DELETE /api/collection/:id
// @access  Public
const deleteCard = async (req, res) => {
    try {
        const deleteCard = await cardService.deleteCard(req.params.id);
        if (!deletedCard) {
            return res.status(404).json({ message: 'Card not found'});
        }
        res.status(200).json({ message: 'Card Deleted successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Error deleting card', error: error.message});
    }
}

module.exports = {
    getAllCards,
    getCardByName,
    addToCollection,
    updateCard,
    deleteCard,
    getCardFromAPI
}