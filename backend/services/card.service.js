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

        if (!scryfallCard) {
            throw new Error(`Card not found with ID: ${scryfallId}`);
        }
        
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
        const scryfallCard = await scryfallService.getCardByName(cardName, exact);
    
        if(!scryfallCard) {
            throw new Error(`Card not found: ${cardName}`);
        }

        const result = await addCardFromScryfall(scryfallCard.id, userData);
        
        return result;
       
    } catch (error) {
        logger.error('Error adding card by name', {
            cardName,
            error: error.message
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

async function fetchRandomFromScryfall() {
    try {
        const raw = await scryfallService.getRandomCard();
        const formatted = {
            _id: raw.id,
            name: raw.name,
            manaCost: raw.mana_cost,
            cmc: raw.cmc,
            colors: raw.colors,
            type: raw.type_line,
            text: raw.oracle_text,
            imageUrl: raw.image_uris?.normal || raw.card_faces?.[0]?.image_uris?.normal,
            set: raw.set,
            rarity: raw.rarity
        };
        return formatted;
    } catch (error) {
        logger.error('Error fetching random card', { error: error.message });
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
    fetchRandomFromScryfall
};