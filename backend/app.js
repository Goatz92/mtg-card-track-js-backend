require('dotenv').config();
const express = require('express');
const cors = require('cors');

const user = require('./routes/user.route');
const auth = require('./routes/auth.route');

const app = express();

// Swagger setup
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MTG Collection API',
      version: '1.0.0',
      description: 'API documentation for Magic: The Gathering Collection Tracker backend'
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 4000}/api` }
    ]
  },
  apis: ['./routes/*.js']
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
// Mount Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use('/api/auth', auth);
app.use('/api/users', user);

//MTG API Base URL
const MTG_API_URL = process.env.MTG_API_URL;

// Health Check Route
app.get('/', (req, res) => {
    res.send('MTG Collection API running');
});

// Card Routes
app.use('/api/cards', require('./routes/card.route'));

module.exports = app;