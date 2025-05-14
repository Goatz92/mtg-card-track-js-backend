const Card = require('../models/card.model');
const mtg = require('mtgsdk');
const logger = require('../logger/logger');
const { search } = require('../app');

function findAll() {
    return Card.find();
}

function findByName(name) {
    return Card.findOne({name: name});
}

function findById(id) {
    return Card.findById(id);
}

async function searchMTGAPI(name) {
    try {
        const result = await mtg.card.where({ name: name});
        return result;
    } catch (error) {
        logger.error('Error searchin MTG API', { error: error.message });
        return false;
    }
}

async function addCard(cardData) {
    try {
        const existingCard = await findByName(cardData.name);
        if (existingCard) {
            existingCard.quantity += cardData.quantity || 1;
            return existingCard.save();
        }

        const apiResult = await searchMTGAPI(cardData.name);
        if(!apiResult || apiResult.length === 0) {
            throw new Error('Card not found in MTG API');
        }

        const mtgCard = apiResult[0];
        const rarityMap = {
            'rare': 'RARE',
            'common': 'COMMON',
            'uncommon': 'UNCOMMON',
            'mythic rare': 'MYTHIC RARE',
            'special': 'SPECIAL'
        };
        
        const newCard = new Card ({
            name: mtgCard.name,
            set: mtgCard.set,
            rarity: rarityMap[mtgCard.rarity.toLowerCase()] || 'SPECIAL',
            quantity: cardData.quantity || 1
        });

        return newCard.save();
    } catch (error) {
        logger.error('Error adding card', { error: error.message });
        throw error;
    }
}