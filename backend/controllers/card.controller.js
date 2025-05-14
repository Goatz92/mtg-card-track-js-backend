const Card = require('../models/Card.model');

// @desc    Get all cards
// @route   GET /api/cards
// @access  Public
const getCards = async (req, res) => {
    try {
        const cards = await Card.find();
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cards', error: error.message });
    }
}

// @desc    Get signle card by ID
// @route   GET /api/cards/:id
// @access  Public
const getCardById = async (req, res) => {
    try {
        const card =await Card.findById(req.params.id);
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
    } catch (error) {
        res.status(500).json({ message: 'Error adding card to collection', error: error.message });
    }
}