require('dotenv').config();
const mongoose = require('mongoose');

// Connection check
const  checkConnection = () => {
    const db = mongoose.connection;
    console.log('MongoDB connection state:', db.states[db.readyState]);
    console.log('Connected to database:', db.name);
    console.log('Connected to host:', db.host);
    console.log('Connected to port:', db.port);
};

const app = require('./app');

const port = process.env.PORT || 4000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(
        () => {
            console.log("Connection to MongoDB established");
            checkConnection();
            app.listen(port, () => {
                console.log(`Server running on port ${port}`);
            });
        })
    .catch(err => console.log(err));
