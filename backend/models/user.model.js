const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema ({
    //Authentication
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    roles: {
        type: [String],
        default: ['USER']
    },

    //Profile Information
    profile: {
        displayName: String,
        avatar: String,
        bio: { type: String, maxlength: 200},
        favoriteColor: {
            type: String,
            enum: ['White', 'Blue', 'Black', 'Red', 'Green', 'Multicolor']
        },
        favoriteFormat: {
            type: String,
            enum: ['Standard', 'Modern', 'Commander', 'Pioneer', 'Legacy', 'Vintage', 'Pauper']
        }
    },

    //Collection Stats
    userCollection: [{
        card: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Card'
        },
        quantity: {
            type: Number,
            default: 1
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Deck Managment
    decks: [{
        name: String,
        format: String,
        featuredCard: String,
        cardCount: Number,
        lastUpdated: Date
    }],

    // Security Timestamps
    lastLogin: Date,
    passwordResetToken: String,
    passwordResetExpires: String,
    emailVerificationToken: String,
    isVerified: { type: Boolean, default: false},

    // Wishlist
    wishlist: [{
        card: { type: Schema.Types.ObjectId, ref: 'Card' },
        desiredQuantity: Number,
        priority: { type: String, enum: ['Low', 'Medium', 'High']}
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true}
});

module.exports = mongoose.model("User", userSchema)