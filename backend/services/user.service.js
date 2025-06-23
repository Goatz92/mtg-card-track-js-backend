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


module.exports = { 
    findAll, 
    findOne, 
    findLastInserted
};