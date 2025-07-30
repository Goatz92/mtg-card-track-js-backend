 # Magic: The Gathering Collection Tracker (Backend)
 
 A RESTful API powering the MTG Collection Tracker app, built with Node.js, Express, MongoDB, and Mongoose. It offers JWT authentication, Scryfall integration, and user-specific collections.
 
 ## Table of Contents
 - [Features](#features)
 - [Prerequisites](#prerequisites)
 - [Getting Started](#getting-started)
 - [Environment Variables](#environment-variables)
 - [API Endpoints](#api-endpoints)
 - [Architecture](#architecture)
 - [Folder Structure](#folder-structure)
 - [Contributing](#contributing)
 - [License](#license)
 
 ## Features
 - User registration, login, and JWT-based authentication
 - Role-based access control (USER, ADMIN)
 - Add and search cards via Scryfall API, including random card fetch
 - Persistent user collections with quantity tracking
 - Data validation, error handling, and structured logging with Winston
 
 ## Prerequisites
 - Node.js >= 14
 - MongoDB instance (local or Atlas)
 - npm or yarn
 
 ## Getting Started
 1. Clone the repository:
    ```bash
    git clone https://github.com/Goatz92/mtg-collection-js-backend.git
    cd mtg-collection-js-backend/backend
    ```
 2. Install dependencies:
    ```bash
    npm install
    ```
 3. Create a `.env` file in `backend/`:
    ```ini
    MONGODB_URI=<your MongoDB URI>
    JWT_SECRET=<your JWT secret>
    PORT=4000
    ```
 4. Start the server:
    ```bash
    npm start
    ```
 5. Access the API at `http://localhost:4000/api`.
 
 ## Environment Variables
 - `MONGODB_URI` — MongoDB connection URI
 - `JWT_SECRET` — Secret key for signing JWTs
 - `PORT` — Port number for the server (default: 4000)
 
 ## API Endpoints
 ### Authentication
 - `POST /api/auth/login` — Authenticate user, returns a JWT token
 
 ### Users
 - `POST /api/users/register` — Create a new user
 - `GET /api/users` — List all users (Admin only)
 - `GET /api/users/:username` — Retrieve a user by username
 - `PATCH /api/users/:username` — Update user details (Admin only)
 - `DELETE /api/users/:username` — Remove a user (Admin only)
 
 ### Cards
 - `GET /api/cards/search/:name` — Search cards by name via the Scryfall API
 - `GET /api/cards/random` — Retrieve a random card
 - `POST /api/cards/scryfall/id/:scryfallId` — Add a card by Scryfall ID
 - `POST /api/cards/scryfall/name/:cardName` — Add a card by name
 
 ### Collections
 - `GET /api/users/:username/collection` — Fetch a user’s card collection
 - `POST /api/users/:username/collection` — Add or increment a card in a user’s collection (body: `{ cardName, quantity }`)
 
 ## Architecture
 - Layered structure: routes → controllers → services → models
 - Mongoose schemas for User, Card, Deck
 - Middleware for authentication (`verifyToken`) and authorization (`verifyRoles`)
 - Winston for structured logging
 
 ## Folder Structure
 ```plaintext
 backend/
 ├ controllers/   # Express route handlers
 ├ middleware/    # Auth and role validation
 ├ models/        # Mongoose schemas
 ├ routes/        # API endpoints
 ├ services/      # Business logic and Scryfall integration
 ├ utils/         # Helpers (responses, errors)
 ├ logger/        # Winston setup
 ├ app.js         # Express app configuration
 └ server.js      # Entry point
 ```
 
 ## Contributing
 Contributions welcome! Please fork, add tests, and submit a pull request.
 
 ## License
 MIT License

# Built With


- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express.js](https://expressjs.com/) - Web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node.js
- [JWT (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken) - Authentication and authorization
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - Password hashing
- [Scryfall API](https://scryfall.com/docs/api) - Magic: The Gathering card data
- [dotenv](https://github.com/motdotla/dotenv) - Environment variable management
- [morgan](https://github.com/expressjs/morgan) - HTTP request logger middleware
- [winston](https://github.com/winstonjs/winston) - Logging library

## Features

- **Core CRUD Features**
    - [x] Add Cards: Manually input new cards with all relevant attributes
    - [x] View Collection: Browse all cards in your collection
    - [x] Search Functionality: Filter cards by name, type, color, etc.
    - [x] Random Card: Fetch a random Magic: The Gathering card from Scryfall
    - [x] Edit Cards: Update any field of existing cards
    - [x] Delete Cards: Remove cards from your collection

- **User System**
    - [x] User registration and authentication
    - [x] Role-based access control (Admin/User)    
    - [ ] Profile customization
    - [ ] Collection statistics

- **Collection Statistics**
    - [x] Total cards count
    - [ ] Value estimation
    - [ ] Breakdown by rarity
    - [ ] Color distribution

- **Deck Management**
    - [ ] Create and manage decks
    - [ ] Track card availability
    - [ ] Multiple format support
    - [ ] Deck statistics

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mtg-collection-js.git
cd mtg-collection-js
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the server
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/users/register` - User registration

### Cards
- `GET /api/cards/search/:name` - Search cards by name
- `POST /api/cards/scryfall/id/:scryfallId` - Add card by Scryfall ID
- `POST /api/cards/scryfall/name/:cardName` - Add card by name

### User Collection

- `GET /api/users/:username/collection`  Get all cards in a user's collection
- `POST /api/users/:username/collection/:cardId`  Add a card to a user's collection (body: `{ "quantity": 1 }`)
- `PUT /api/users/:username/collection/:cardId`  
Update the quantity or details of a card in a user's collection (body: `{ "quantity": 3 }`)
- `DELETE /api/users/:username/collection/:cardId`  Remove a card from a user's collection

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:username` - Get user by username
- `PATCH /api/users/:username` - Update user (Admin only)
- `DELETE /api/users/:username` - Delete user (Admin only)
