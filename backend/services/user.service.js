const User = require('../models/user.model');
const Card = require('../models/card.model');   
const logger = require('../logger/logger');

async function findAll() {
    try {
        const result = await User.find();
        logger.debug(`Found ${result.length} users`);
        return result;
    } catch (error) {
        logger.error('Error finding all users', { error: error.message });
        throw error;
    }
}

async function findOne(username) {
    try {
        const result = await User.findOne({ username });
        logger.debug(`Found user: ${username}`);
        return result;
    } catch (error) {
        logger.error('Error finding user', { username, error: error.message });
        throw error;
    }
}

async function findLastInserted() {
    try {
        const result = await User.find().sort({ _id: -1 }).limit(1);
        logger.debug('Found last inserted user');
        return result[0];
    } catch (error) {
        logger.error('Error finding last inserted user', { error: error.message });
        throw error;
    }
}

async function addCardToCollection(username, cardId, quantity = 1) {
    try {
        // Verify card exists
        const card = await Card.findById(cardId);
        if(!card) {
            logger.error('Card not found', { cardId });
            throw new Error('Card not found');
        }
        // Update user collection
        const user = await User.findOneAndUpdate(
            { username },
            {
                $addToSet: {
                    'collection.cards' : {
                        card: cardId,
                        quantity: quantity
                    }
                },
                $inc: { 'collection.totalCards': quantity }
            },
            { new: true }
        );

        if(!user) {
            logger.error('User not found', { username });
            throw new Error('User not found');
        }

        logger.debug(`Added card ${cardId} to ${username}'s collection`, { quantity })
        return user;
    } catch (error) {
        logger.error('Error adding card to collection', {
            username,
            cardId,
            error: error.message
        });
    }
}

async function removeCardFromCollection(username, cardId) {
    try {
        const user = await User.findOne({ username });
        if(!user) {
            logger.error('User not found', { username });
            throw new Error('User not found');
        }
        // Find card to get quantity before removal
        const cardEntry = user.collection.cards.find(c => c.card.equals(cardId));
        if (!cardEntry) {
            logger.error('Card not found in collection', { username, cardId });
            throw new Error('Card not found in Collection');
        }

        const updateUser = await User.findOneAndUpdate(
            { username },
            {
                $pull: { 'collectionStats.cards': { card: cardId } },
                $inc: { 'collection.totalCards': -cardEntry.quantity }
            },
            { new: true }
        );

        logger.debug(`Removed card ${cardId} from ${username}'s collection`);
        return updatedUser;
    } catch (error) {
        logger.error('Error removing card from collection', {
            username,
            cardId,
            error: error.message
        });
        throw error;
    }
}

async function updateCardQuantity(username, cardId, newQuantity) {
    try {
        const user = await User.findOneAndUpdate(
            { username, 'collection.cards.card': cardId },
            { $set: { 'collectionStats.cards.$.quantity': newQuantity } },
            { new: true }
        );
        return user;
    } catch (error) {
        logger.error('Error updating card quantity', { username, cardId, error: error.message });
        throw error;
    }
}

module.exports = { 
    findAll, 
    findOne, 
    findLastInserted,
    addCardToCollection,
    removeCardFromCollection,
    updateCardQuantity
};