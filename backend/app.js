require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cardRoutes = require('./routes/card.route');

const app = express();

app.use(cors({
    // origin: '*'
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use(express.json());

//MTG API Base URL
const MTG_API_URL = process.env.MTG_API_URL;

// Health Check Route
app.get('/', (req, res) => {
    res.send('MTG Collection API running');
});

// Card Routes
app.use('/api/cards', require('./routes/card.route'));

module.exports = app;