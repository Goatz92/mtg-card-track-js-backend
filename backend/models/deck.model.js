const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deckSchema = Schema ({
    
    // Core Identification
    name: {
        type: String,
        required: [true, 'Deck name is required'],
        trim: true,
        index: true
    },
    colors: [{
        type: String,
        enum: ['W', 'U', 'B', 'R', 'G']
    }],
    archetype: [{
        type: String,
        trim: true,
        index: true
    }],
    hybridArchetype: [{
        type: String,
        trim: true,
        index: true
    }]
})