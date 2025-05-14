require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const port = process.env.PORT || 5000;

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//MTG API Base URL
const mtgApiBaseUrl = process.env.MTG_API_BASE_URL;

mongoose.connect(process.env.MONGODB_URI)
    .then(
        () => {
            console.log('MongoDB connected');
            app.listen(port, () => {
                console.log(`Server running on port ${port}`);
            });
        })
    .catch(err => console.log(err));

//Routes
app.get('/', (req, res) => {
    res.send('MTG Collection API running');
});

