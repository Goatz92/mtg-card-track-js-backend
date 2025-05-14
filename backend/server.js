require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 4000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(
        () => {
            console.log("Connection to MongoDB established");
            app.listen(port, () => {
                console.log(`Server running on port ${port}`);
            });
        })
    .catch(err => console.log(err));
