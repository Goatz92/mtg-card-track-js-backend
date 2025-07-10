const cardService = require('../services/card.service');
const logger = require ('../logger/logger');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const searchCardScryfall = async (req, res) => {
    try {
        const cardsFromScryfall = await cardService.searchScryfallAPI(req.params.name);
        
        const cardArray = Array.isArray(cardsFromScryfall) ? cardsFromScryfall : [cardsFromScryfall];

        const formattedCards = cardArray.map(card => ({
            _id: card.id,
            name: card.name,
            manaCost: card.mana_cost,
            cmc: card.cmc,
            colors: card.colors,
            type: card.type_line,
            text: card.oracle_text,
            imageUrl: card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal,
            set: card.set,
            rarity: card.rarity
        }));
        
        res.json(formattedCards);
    } catch (error) {
        res.status(500).json({ error: message });
    }
}

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

const addCardFromScryfallByName = async (req, res) => {
    try {

        const { cardName } = req.params;
        const { exact = true } = req.query;
        const userData = req.body;

        const result = await cardService.addCardFromScryfallByName(cardName, userData, exact);

        if (result?.status === 'MULTIPLE_VERSIONS') {
            return successResponse(res, 300, result.cards, 'Multiple versions found');
        }
        successResponse(res, 201, result, `Card added successfully: ${cardName}`); 
    } catch (error) {
        logger.error('Error adding card by name', { 
            name: req.params.cardName, 
            error: error.message 
        });
        errorResponse(res, 500, 'Error adding card', error);
    }
}

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
    addCardFromScryfall,
    addCardFromScryfallByName
};