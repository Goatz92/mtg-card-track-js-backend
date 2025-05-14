require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//MTG API Base URL
const MTG_API_URL = process.env.MTG_API_URL;


//Example route to fetch card data from MTG API
app.get('/api/cards/:name', async (req, res) => {
    try {
        const response = await axios.get(`${MTG_API_URL}/cards`, {
            params: {
                name: req.params.name
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching card data from MTG API', error: error.message });
    }
});

//Routes
app.get('/', (req, res) => {
    res.send('MTG Collection API running');
});
app.use('/api/cards', require('./routes/card.route'));

module.exports = app;