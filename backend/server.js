require('dotenv').config();
const mongoose = require('mongoose');

const port = process.env.PORT || 5000;

const app = express();

mongoose.connect(process.env.MONGODB_URI)
    .then(
        () => {
            console.log('MongoDB connected');
            app.listen(port, () => {
                console.log(`Server running on port ${port}`);
            });
        })
    .catch(err => console.log(err));
