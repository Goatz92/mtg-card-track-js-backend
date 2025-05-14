const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    set: {
        type: String,
        required: true,
    },
    rarity: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    imageUrl: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);