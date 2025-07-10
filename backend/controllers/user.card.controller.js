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
                // Add other relevant fields from scryfallCard
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


// exports.addToCollection = async (req, res) => {
//     const { username } = req.params;
//     const { cardName, quantity = 1 } = req.body;

//     try {
//         // Find/create the card
//         let card = await Card.findOne({ name: cardName });
//         if (!card) {
//             const scryfallData = await scryfallService.getCardByName(cardName);
//             if (!scryfallData) {
//                 return errorResponse(res, 404, 'Card not found on Scryfall');
//             }

//             // Create a new card entry
//             card = await Card.create({
//                 // Core Identification
//                 scryfallId: scryfallData.id,
//                 name: scryfallData.name,
//                 multiverseId: scryfallData.multiverse_ids?.[0]?.toString(),

//                 // Gameplay Properties
//                 manaCost: scryfallData.mana_cost || '',
//                 cmc: scryfallData.cmc || 0,
//                 colors: scryfallData.colors || [],
//                 colorIdentity: scryfallData.color_identity || [],
//                 types: scryfallData.type_line.split('—')[0].trim().split(' ') || [],
//                 subtypes: scryfallData.subtypes || [],
//                 oracleText: scryfallData.oracle_text || '',
//                 power: scryfallData.power || '',
//                 toughness: scryfallData.toughness || '',
//                 loyalty: scryfallData.loyalty || '',

//                 // Collection Properties
//                 rarity: scryfallData.rarity?.toUpperCase(),
//                 set: scryfallData.set?.toUpperCase(),
//                 setName: scryfallData.set_name,
//                 collectorNumber: scryfallData.collector_number,
//                 isFoil: false, // Default to non-foil, can be overridden later
//                 imageUris: scryfallData.image_uris || {
//                     small: scryfallData.card_faces?.[0]?.image_uris?.small || '',
//                     normal: scryfallData.card_faces?.[0]?.image_uris?.normal || '',
//                     large: scryfallData.card_faces?.[0]?.image_uris?.large || '',
//                     png: scryfallData.card_faces?.[0]?.image_uris?.png || '',
//                     art_crop: scryfallData.card_faces?.[0]?.image_uris?.art_crop || '',
//                     border_crop: scryfallData.card_faces?.[0]?.image_uris?.border_crop || ''
//                 },
//                 artist: scryfallData.artist || 'Unknown',
//                 flavorText: scryfallData.flavor_text || '',

//                 // Game Properties
//                 layout: scryfallData.layout,
//                 finishes: scryfallData.finishes || ['nonfoil'], // Default to non-foil
//                 prices: {
//                     usd: scryfallData.prices?.usd || '',
//                     usd_foil: scryfallData.prices?.usd_foil || '',
//                     eur: scryfallData.prices?.eur || '',
//                     tix: scryfallData.prices?.tix || ''
//                 }
//             })
//         }

//         // Find the user
//         const user = await User.findOne({ username });
//         if (!user) {
//             return errorResponse(res, 404, 'User not found');
//     }

//     // Check if card already exists in user's collection
//         const existingCardIndex = user.userCollection.findIndex(
//             item => item.card && item.card.equals(card._id)
//         );

//         if (existingCardIndex >= 0) {
//             user.userCollection[existingCardIndex].quantity += quantity;
//         } else {
//             user.userCollection.push({ 
//                 card: card._id, 
//                 quantity
//             });
//         }
//         await user.save();

//         return successResponse(res, 200, {
//             message: 'Card added to collection successfully',
//             card: card.name,
//             quantity: quantity
//         });
//     } catch (error) {
//         logger.error('Error adding card to collection', {
//             username,
//             cardName,
//             error: error.message
//         });
//         return errorResponse(res, 500, 'Failed to add card to collection');
//     }
// };
