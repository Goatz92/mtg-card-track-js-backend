const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
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
    }
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);