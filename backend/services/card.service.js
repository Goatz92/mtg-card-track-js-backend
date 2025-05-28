const Card = require('../models/card.model');
const scryfallService = require('./scryfall.service');
const logger = require('../logger/logger');
const mongoose = require('mongoose');

// Basic CRUD Operations
function findAll() {
    return Card.find();
}

function findByName(name) {
    return Card.findOne({name: name});
}

function findById(id) {
    return Card.findById(id);
}

// Scryfall Integration
async function searchScryfallAPI(name, exact = true) {
    try {
        const cards = await scryfallService.getCardByName(name, exact);
        return Array.isArray(cards) ? cards : [cards]; 
    } catch (error) {
        logger.error('Error searching in Scryfall API', {error: error.message });
        throw error;
    }
}

async function addCardFromScryfall(scryfallId, userData = {}) {
    try {
        // Check if card already exists
        const existingCard = await Card.findOne({ scryfallId });
        if (existingCard) {
            existingCard.quantity += userData.quantity || 1;
            return existingCard.save();
        }

        // Fetch from Scryfall API
        const scryfallCard = await scryfallService.getCardById(scryfallId);
        
        // Transform to my schema
        const cardData = {
            scryfallId: scryfallCard.id,
            name: scryfallCard.name,
            manaCost: scryfallCard.mana_cost,
            cmc: scryfallCard.cmc,
            colors: scryfallCard.colors,
            type: scryfallCard.type_line,
            rarity: scryfallCard.rarity.toUpperCase(),
            set: scryfallCard.set.toUpperCase(),
            setName: scryfallCard.set_name,
            imageUrl: scryfallCard.image_uris?.normal || 
                     scryfallCard.card_faces?.[0]?.image_uris?.normal,
            quantity: userData.quantity || 1,
            isFoil: userData.isFoil || false
        };

        const newCard = new Card(cardData);
        return newCard.save();
    } catch (error) {
        logger.error('Error adding card from Scryfall', {
            scryfallId,
            error: error.message
        });
        throw error;
    }
}

async function addCardFromScryfallByName(cardName, userData = {}, exact = true) {
    try {
        // Search Scryfall by name
        const scryfallCards = await scryfallService.getCardByName(cardName, exact);
        const cards = Array.isArray(scryfallCards) ? scryfallCards : [scryfallCards];

        if(cards.length === 0) {
            throw new Error(`Card not found: ${cardName}`);
        }

        // Check if multiple versions exist
        if (cards.length > 1 ) {
            return {
                status: 'MULTIPLE_VERSIONS',
                cards: cards.map(cards => ({
                    id: card.id,
                    name: card.name,
                    set: card.set_name,
                    set_code: card.set,
                    collector_number: card.collector_number,
                    imageUrl: card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal
                }))
            };
        }

        // Get Scryfall ID from single result
        const scryfallId = cards[0];

        // Check if card exists
        const existingCard = await Card.findOne({ scryfallId });

        if (existingCard) {
            // Update quantity
            existingCard.quantity += userData.quantity || 1;
            return existingCard.save;
        }

        // Add card using existing function if it already exists
        return addCardFromScryfall(scryfallId, userData);
    } catch (err) {
        logger.error('Error adding card by name', {
            cardName,
            error: err.message
        });
        throw error;
    }
}

async function deleteCard(id) {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid card ID Format');
        }

        const deletedCard = await Card.findByIdAndDelete(id);
        
        if(!deletedCard) {
            logger.info('Card not found for deletion', { cardId: id});
            return null;
        }

        logger.info('Card successfully deleted', {
            cardId: deletedCard._id,
            cardName: deletedCard.name
        });

        return deletedCard;
    } catch(error) {
        logger.error('Error deleting card', {
            cardId: id,
            error: error.message
        });
        throw error;
    }
}

module.exports = {
    findAll,
    findByName,
    findById,
    searchScryfallAPI,
    addCardFromScryfall,
    addCardFromScryfallByName,
    deleteCard
};