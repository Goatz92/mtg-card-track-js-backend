const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardSchema = new Schema({ 
    name: {
        type: String,
        required: [true, 'Card name is required'],
        trim: true,
        index: true // Add index for faster searches
    },
    set: {
        type: String,
        required: [true, 'Card set is required'],
        trim: true
    },
    rarity: {
        type: String,
        required: [true, 'Card rarity is required'],
        enum: ["COMMON", "UNCOMMON", "RARE", "MYTHIC RARE", "SPECIAL"]
    },
    quantity: {
        type: Number,
        default: 1,
        min: [0, 'Quantity cannot be negative'],
        validate: {
            validator: Number.isInteger,
            message: 'Quantity must be a whole number'
        }
    }
}, { 
    collection: 'cards',
    timestamps: true
});

// Add compound index for common queries
// cardSchema.index({ name: 1, set: 1 }, { unique: true });

module.exports = mongoose.model('Cards', cardSchema);