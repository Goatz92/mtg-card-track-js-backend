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
    try {
        const { username, scryfallId } = req.params;
        const { quantity = 1, isFoil = false, condition = 'NEAR_MINT' } = req.body;

        let card = await Card.findOne({ scryfallId });
        if(!card) {
            const scryfallData = await scryfallService.getCardById(scryfallId);
            card = await Card.create({
                scryfallId: scryfallData.id,
                name: scryfallData.name,
                multiversId: scryfallData.multivers_ids?.[0] || null,
                manaCost: scryfallData.mana_cost || '',
                cmc: scryfallData.cmc || 0,
                colors: scryfallData.colors || [],
                colorIdentity: scryfallData.color_identity || [],
                type: scryfallData.type_line || '',
                types: scryfallData.card_faces
                    ? [...new Set(scryfallData.card_faces.flatMap(face => face.type_line.split('-')[0].trim().split(' ')))]
                    : scryfallData.type_line.split('-')[0].trim().split(' '),
                subtypes: scryfallData.subtypes || [], 
                text: scryfallData.oracle_text || [],
                power: scryfallData.power || '',
                toughness: scryfallData.toughness || '',
                loyalty: scryfallData.loyalty || '',
                rarity: scryfallData.rarity.toUpperCase(),
                setName: scryfallData.setName,
                collectorNumber: scryfallData.collector_number,
                isFoil: scryfallData.foil,
                imageUris: scryfallData.imageUris || {
                    small: scryfallData.card_faces?.[0]?.image_uris?.small || '',
                    normal: scryfallData.card_faces?.[0]?.image_uris?.normal || '',
                    large: scryfallData.card_faces?.[0]?.image_uris?.large || '',
                    png: scryfallData.card_faces?.[0]?.image_uris?.png || '',
                    art_crop: scryfallData.card_faces?.[0]?.image_uris?.png || '',
                    border_crop: scryfallData.card_faces?.[0]?.image_uris?.border_crop || ''
                },
                artist: scryfalldata.artist || 'Unkown',
                flavor: scryfallData.flavor_text || '',
                layout: scryfallData.layout,
                finishes: scryfallData.finishes || [],
                quantity: 0, // Initialize to 0 until user adds one
                condition: 'NEAR_MINT' // Default condition
            });
        }

        const user = await User.findOne({ username });
        if(!user) {
            return errorResponse(res, 404, 'User not found');
        }

        const existingCardIndex = user.userCollection.findIndex(
            item => item.card.equals(card._id) 
        );

        if (existingCardIndex >= 0) {
            user.userCollection[existingCardIndex].quantity += quantity;
            await user.save();
            return successResponse(res, 200, user.userCollection, 'Card quantity updated')
        }

        user.userCollection.push({
            card: card._id,
            name: card.name,
            quantity,
            isFoil,
            condition
        });
        await user.save();

        successResponse(res, 201, user.userCollection, 'Card added to collection');
    } catch (error) {
        logger.error('Error adding card to collection', {
            username: req.params.username,
            scryfallId: req.params.scryfallId,
            error: error.message
        });
        errorResponse(res, 500, 'Failed to add card to collection');
    }
};