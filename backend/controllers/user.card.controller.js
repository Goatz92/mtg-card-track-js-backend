const User = require('../models/user.model');
const Card = require('../models/card.model');
const logger = require('../logger/logger');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const scryfallService = require('../services/scryfall.service');

exports.getUserCollection = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username })
            .populate({
                path: 'userCollection.card',
                select: 'name scryfall imageUris.normal type rarity'
            })
            .select('userCollection -_id');

        if(!user) {
            return errorResponse(res, 404, 'User not found');
        } else {
            successResponse(res, 200, user.userCollection, 'Collection retrieved successfully');
        }
    } catch (error) {
        logger.error('Error fetching user collection', {
            username: req.params.username,
            error: error.message
        });
        errorResponse(res, 500, 'Failed to fetch collection');
    }
};

exports.addToCollection = async (req, res) => {
    const { username } = req.params;
    const { cardName, quantity = 1 } = req.body;

    try {
        // 1. Find or create the card in your database
        let card = await Card.findOne({ name: cardName });

        if (!card) {
            // 2. Fetch card data from Scryfall by name
            const scryfallData = await scryfallService.getCardByName(cardName);

            if (!scryfallData) {
                return errorResponse(res, 404, 'Card not found on Scryfall');
            }

            // 3. Create the card in your database
            card = await Card.create({
                name: scryfallData.name,
                scryfallId: scryfallData.id,
                rarity: scryfallData.rarity.toUpperCase(),
                set: scryfallData.set.toUpperCase(),
                setName: scryfallData.set_name,
                imageUris: scryfallData.image_uris
            });
        }

        // 4. Find the user
        const user = await User.findOne({ username });

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        // 5. Check if the card is already in the user's collection
        const existingCardIndex = user.userCollection.findIndex(item => item.card && item.card.equals(card._id)
        );

        if (existingCardIndex >= 0) {
            // 6a. If it exists, increment the quantity
            user.userCollection[existingCardIndex].quantity += quantity;
        } else {
            // 6b. If it doesn't exist, add the card to the collection
            user.userCollection.push({
                card: card._id,
                quantity: quantity
            });
        }

        // 7. Save the user
        await user.save();

        // 8. Return a success response
        return successResponse(res, 200, {
            message: 'Card added to collection',
            card: card.name,
            quantity: quantity
        });
    } catch (error) {
        console.error(error);
        return errorResponse(res, 500, 'Error adding card to collection', error);
    }
};
