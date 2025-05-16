const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardSchema = new Schema({ 

    // Core Identification
    name: {
        type: String,
        required: [true, 'Card name is required'],
        trim: true,
        index: true // Add index for faster searches
    },
    scryfallId: {
        type: String,
        unique: true
    },
    multiverseId: String,

    // Gameplay Properties
    manaCost: String,
    // Converted Mana Cost
    cmc: {
        type: Number,
        min: 0
    },
    colors: [{
        type: String,
        enum: ['W', 'U', 'B', 'R', 'G', 'C'] // C for Colorless
    }],
    colorIdentity: [{
        type: String,
        enum: ['W', 'U', 'B', 'R', 'G', 'C']
    }],
    type: String,
    types: [String],
    subtypes: [String],
    text: String,
    power: String, // String to handle values like "*" / "1+1" / "*+1"
    toughness: String,
    loyalty: String,

    //Collection Properties
    rarity: {
        type: String,
        required: true,
        enum: ["COMMON", "UNCOMMON", "RARE", "MYTHIC", "SPECIAL", "BONUS"]
    },
    set: {
        type: String,
        required: true,
        uppercase: true
    },
    setName: String,
    collectorNumber: String,
    isFoil: {
        type: Boolean,
        default: false
    },
    quantity: {
        type: Number,
        default: 1,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'Quantity must be a whole number'
        }
    },
    imageUris: {
        small: String,
        normal: String,
        large: String,
        png: String,
        art_crop: String,
        border_crop: String
    },
    artist: String,
    flavor: String,

    // Game properties
    layout: {
        type: String,
        enum: ['normal', 'split', 'flip', 'transform', 'meld', 'leveler', 'saga', 'planar', 'scheme', 'vanguard', 'token', 'double_faced_token', 'emblem', 'augment', 'host']
    },
    finishes: [{
        type: String,
        enum: ['nonfoil', 'foil', 'etched', 'glossy']
    }],

    // User-specific
    condition: {
        type:String,
        enum: ['MINT', 'NEAR_MINT', 'LIGHTLY_PLAYED', 'MODERATELY_PLAYED', 'HEAVILY_PLAYED', 'DAMAGED'],
        default: 'NEAR_MINT'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'cards',
    timestamps: true,
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
})

// Compound index for faster queries
cardSchema.index({ name: 1, set: 1, collectorNumber: 1}, { unique: true});
cardSchema.index({ set: 1, collectorNumber: 1});
cardSchema.index({ colors: 1, cmc: 1});

// Virtual for frontend display
cardSchema.virtual('displayName').get(function() {
    return `${this.name} (${this.set.toUpperCase()}) ${this.collectorNumber}`;
});

module.exports = mongoose.model('Card', cardSchema, 'cards');