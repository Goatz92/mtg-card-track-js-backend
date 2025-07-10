const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardSchema = new Schema({ 

    // Core Identification
    name: {
        type: String,
        required: [true, 'Card name is required'],
        trim: true,
        index: true,
        text: true 
    },
    scryfallId: {
        type: String,
        unique: true,
        index: true
    },
    multiverseId: {
        type: String,
        index: true,
        sparse: true
    },

    // Gameplay Properties
    manaCost: String,
    cmc: {
        type: Number,
        min: 0,
        index: true
    },
    colors: [{
        type: String,
        enum: ['W', 'U', 'B', 'R', 'G', 'C'] ,// C for Colorless
        index: true
    }],
    colorIdentity: [{
        type: String,
        enum: ['W', 'U', 'B', 'R', 'G', 'C']
    }],
    // Card type (Dragon, Eldrazi, etc)
    // cardType: {
    //     type: String,
    //     index: true
    // },
    // Cards may have multiple types (Phyrexian Demon)
    types: {
        type: [ String ],
        default: [],
        index: true
    },
    subtypes: {
        type: [String],
        index: true
    },
    oracleText: {
        type: String,
        text: true
    },
    power: String, // String to handle values like "*" / "1+1" / "*+1"
    toughness: String,
    loyalty: String,

    //Collection Properties
    rarity: {
        type: String,
        required: true,
        enum: ["COMMON", "UNCOMMON", "RARE", "MYTHIC", "SPECIAL", "BONUS"],
        index: true
    },
    set: {
        type: String,
        required: true,
        uppercase: true,
        index: true
    },
    setName: String,
    collectorNumber: {
        type: String,
        index: true
    },
    isFoil: {
        type: Boolean,
        default: false
    },
    imageUris: {
        small: String,
        normal: String,
        large: String,
        png: String,
        art_crop: String,
        border_crop: String
    },
    default: {},
    artist: String,
    flavorText: String,

    // Game properties
    layout: {
        type: String,
        enum: ['normal', 'split', 'flip', 'transform', 'meld', 'leveler', 'saga', 'planar', 'scheme', 'vanguard', 'token', 'double_faced_token', 'emblem', 'augment', 'host']
    },
    finishes: [{
        type: String,
        enum: ['nonfoil', 'foil', 'etched', 'glossy']
    }],
    prices: {
        usd: String,
        usd_foil: String,
        eur: String,
        tix: String
    },

    // User-specific
    
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'cards',
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.__v;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

// Compound indexes for faster queries
cardSchema.index({ name: 1, set: 1});
cardSchema.index({ set: 1, collectorNumber: 1});
cardSchema.index({ colors: 1, cmc: 1});
cardSchema.index({ type: 1, subtypes: 1});

module.exports = mongoose.model('Card', cardSchema, 'cards');