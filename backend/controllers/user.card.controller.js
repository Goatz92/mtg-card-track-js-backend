const User = require('../models/user/model');
const Card = require('../models/card.model');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getUserCollection = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username })
            .populate({
                path: 'collection.card',
                select: 'name scryfall imageUris.normal type rarity'
            })
            .select('collection -_id');

        if(!user) {
            return errorResponse(res, 404, 'User not found');
        } else {
            successResponse(res, 200, user.collection, 'Collection retrieved successfully');
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
    try {
        const { username, scryfallId } = req.params;
        const { quantity = 1, isFoil = false, condition = 'NEAR_MINT' } = req.body;

        let card = await Card.findOune({ scryfallId});
        if(!card) {
            const scryfallData = await scryfallService.getCardById(scryfallId);
            card = await Card.create({
                scryfallId: scryfallData.id,
                name: scryfallData.name,
            });
        }

        const user = await User.findOneAndUpdate(
            { username, 'collection.card': { $ne: card._id } },
            {
                $push: {
                    collection: {
                        card: card._id,
                        quantity,
                        isFoil,
                        condition
                    }
                }
            },
            { new: true, upsert: false }
        ).populate('collection.card');

        if(!user) {
            return errorResponse(res, 400, 'Card already in collection');
        }

        successResponse(res, 201, user.collection, 'Card added to collection');
    } catch (error) {
        logger.error('Error adding card to collection', {
            username: req.params.username,
            scryfallId: req.params.scryfallId,
            error: error.message
        });
        errorResponse(res, 500, 'Failed to add card to collection');
    }
};