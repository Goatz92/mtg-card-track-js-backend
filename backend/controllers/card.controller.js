const Card = require('../models/Card.model');
const mtg = require('mtgsdk');

// @desc    Search for MTG cards from MTG API by name
// @route   GET /api/cards/search/:name
// @access  Public
const getCardFromAPI = async (req, res) => {
    try {
        const cards = await mtg.card.where({ name: req.params.name });
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cards', error: error.message });
    }
}

// @desc    Get all cards
// @route   GET /api/cards
// @access  Public
const getAllCards = async (req, res) => {
    try {
        const cards = await Card.find();
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cards', error: error.message });
    }
}

// @desc    Get signle card by Name 
// @route   GET /api/cards/:name
// @access  Public
const getCardByName = async (req, res) => {
    try {
        const card =await Card.findByName(req.params.id);
        res.status(200).json(card);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching card', error: error.message });
    }
}

// @desc    Add a card to user's collection
// @route   POST /api/collection
// @access  Public
const addToCollection = async (req, res) => {
    try {
        const { name, quantity } = req.body;
        console.log('1. Request received: ', {name, quantity});

        // Fetch card data from MTG API
        const result = await mtg.card.where({ name: name });
        console.log('2. MTG API response:', result[0]);

        if (!result || result.length === 0) {
            return res.status(404).json({ message: 'Card not found in MTG API' });
        }

        const cardData = result[0];
        console.log('3. Card data:', cardData);

         // Transform rarity to match enum
        const rarityMap = {
            'rare': 'RARE',
            'common': 'COMMON',
            'uncommon': 'UNCOMMON',
            'mythic rare': 'MYTHIC RARE',
            'special': 'SPECIAL'
        };

        const mappedRarity = rarityMap[cardData.rarity.toLowerCase()];
        console.log('4. Mapped rarity:', mappedRarity);
        if (!mappedRarity) {
            return res.status(400).json({ message: 'Invalid rarity type' });
        }

        // Save to collection
        const newCard = new Card({
            name: cardData.name,
            set: cardData.set,
            rarity: rarityMap[cardData.rarity.toLowerCase()] || 'SPECIAL',
            quantity: quantity || 1,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        console.log('5. Attempt to save:', newCard);
        const savedCard = await newCard.save();
        console.log('6. Card saved:', savedCard);

        if (!savedCard) {
            return res.status(500).json({ message: 'Error saving card to collection' });
        }
        res.status(201).json(savedCard);
    } catch (error) {
        console.error('Error in Details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        return res.status(500).json({ 
            message: 'Error adding card to collection', error: error.message 
        });
    }
}

// @desc    Update a card in user's collection
// @route   PUT /api/collection/:id
// @access  Public
const updateCard = async (req, res) => {
    try {
        const { quantity } = req.body;
        const updatedCard = await Card.findByIdAndUpdate(
            req.params.id,
            {
                quantity,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );
        if (!updatedCard) {
            return res.status(404).json({ message: 'Card not found' });
        }

        res.status(200).json(updatedCard);
    } catch (error) {
        res.status(500).json({ message: 'Error updating card', error: error.message });
    }
}

//@ desc    Remove a card from user's collection
// @route   DELETE /api/collection/:id
// @access  Public
const deleteCard = async (req, res) => {
    try {
        const deletedCard = await Card.findByIdAndDelete(req.params.id);
        if (!deletedCard) {
            return res.status(404).json({ message: 'Card not found' });
        }
        res.status(200).json({ message: 'Card deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting card', error: error.message });
    }
}

module.exports = {
    getAllCards,
    getCardByName,
    addToCollection,
    updateCard,
    deleteCard,
    getCardFromAPI
}