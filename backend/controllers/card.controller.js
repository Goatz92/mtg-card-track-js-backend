const cardService = require('../services/card.service');
const logger = require ('../logger/logger');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// @desc Search Scryfall for a card
// @route GET /search/:name
const searchCardScryfall = async (req, res) => {
    try {
        const cards = await cardService.searchScryfallAPI(req.params.name);
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: message });
    }
}

// @desc    Add card From Scryfall
// @route   GET /api/cards/scryfall/:scryfallId
// @access  Public
const addCardFromScryfall = async (req, res) => {
    try {
        const { scryfallId } = req.params;
        const userData = req.body;

        const card = await cardService.addCardFromScryfall(scryfallId, userData);

        successResponse(res, 201, card, 'Card added succesfully');
    } catch (error) {
        errorResponse(res, 500, 'Error adding card', error);
    }
};

// @desc    Get all cards from database
// @route   GET /api/cards
// @access  Public
const getAllCards = async (req, res) => {
    try {
        const cards = await cardService.findAll();
        logger.debug(`Found ${cards.length} cards`);
        successResponse(res, 200, cards, 'Card retrieved successfully');
    } catch(error) {
        logger.error('Error fetching Cards', { error: error.message });
        errorResponse(res, 500, 'Error fetching card from API');
    }
}

// @desc    Get single card by Name 
// @route   GET /api/cards/:name
// @access  Public
const getCardByName = async (req, res) => {
    try {
        const decodedName = decodeURIComponent(req.params.name);
        const card = await cardService.findByName(decodedName);

        if(!card) {
            return errorResponse(res, 404, 'Card not found');
        }
        successResponse(res, 200, card, 'Card retrieved successfully');
    } catch (error) {
        errorResponse(res, 500, 'Error fetching card', error);
    }
}

// @desc    Update a card in user's collection
// @route   PUT /api/collection/:id
// @access  Public
const updateCard = async (req, res) => {
    try {
        const updatedCard = await cardService.updateCard(
            req.params.id, 
            req.body.quantity
        );

        if(!updatedCard) {
            return errorResponse(res, 404, 'Card not found');
        }
        successResponse(res, 200, updatedCard, 'Card updated succesfully');
    } catch (error) {
        logger.error('Error updating Card', {
            cardId: req.params.id,
            error: error.message
        })
        errorResponse(res, 500, 'Error updating Card', error);
    }
}

// @desc    Remove a card from user's collection
// @route   DELETE /api/collection/:id
// @access  Public
const deleteCard = async (req, res) => {
    try {
        const deletedCard = await cardService.deleteCard(req.params.id);
        if (!deletedCard) {
            return errorResponse(res, 404, 'Card not found');
        }
        
        successResponse(res, 200, deletedCard, 'Card deleted succesfully');
    } catch (error) {
        logger.error('Error deleting Card', {
            cardId: req.params.id,
            error: error.message
        });
        errorResponse(res, 500, 'Error deleting card', error);
    }
};

module.exports = {
    getAllCards,
    getCardByName,
    updateCard,
    deleteCard,
    searchCardScryfall,
    addCardFromScryfall
};

// @desc    Search for cards in MTG API by name
// @route   GET /api/cards/search/:name
// @access  Public
// const getCardFromAPI = async (req, res) => {
//     try {
//         const card = await cardService.searchMTGAPI(req.params.name);
//         if (!card || card.length === 0) {
//             return errorResponse(res, 404, 'Card not found');
//         }
//         successResponse(res, 200, card, 'Card retrieved successfully');
//     } catch (error) {
//         logger.error('Error searcing MTG API', { error: error.message});
//         errorResponse(res, 500, 'Error fetching cards from API', error);
//     }
// } 


// @desc    Add a card to user's collection
// @route   POST /api/collection
// @access  Public
// const addToCollection = async (req, res) => {
//     try {
//         const savedCard = await cardService.addCard(req.body);
//         successResponse(res, 201, savedCard, 'Card added to collection succesfully');
//     } catch (error) {
//         logger.error('Error adding card', {
//             cardData: req.body,
//             error: error.message
//         });

//         const status = error.message.includes('not found') ? 404 : 500;
//         errorResponse(res, status, error.message, error);
//     }
// }

