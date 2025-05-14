const Card = require('../models/Card.model');

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
        const { cardId, quantity } = req.body;

        // Fetch card data from MTG API
        const mtgResponse = await axios.get(`${process.env.MTG_API_URL}/cards/${cardId}`);
        const cardData = mtgResponse.data.card;

        // Save to collection
        const newCard = await Card.create({
            mtgId: cardData.id,
            name: cardData.name,
            set: cardData.set,
            rarity: cardData.rarity,
            quantity: quantity
        });
        res.status(201).json(newCard);
    } catch (error) {
        res.status(500).json({ message: 'Error adding card to collection', error: error.message });
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
}