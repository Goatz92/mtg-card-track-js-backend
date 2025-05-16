require('dotenv').config();
const mongoose = require('mongoose');
const { logger } = require('./logger/logger');

const app = require('./app');
const port = process.env.PORT || 4000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
})
.then(() => {
    logger.info('MongoDB connection succesfully established');
    const db = mongoose.connection;
    logger.info('MongoDB connection status', {
        database: db.name,
        host: db.host,
        port: db.port
    });

    app.listen(port, () => {
        logger.info(`Server started on port: ${port}`);
    });
})
.catch (err => {
    logger.error('MongoDB connection failed', {
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
    process.exit(1);
});

// Event listeners
mongoose.connection.on('connected', () => {
    logger.info('Mongoose default connection open');
});

mongoose.connection.on('error', (err) => {
    logger.error('Mongoose default connection error', {
        error: {
            name: err.name,
            message: err.message,
            code: err.code
        },
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

mongoose.connection.on('disconnected', () => {
    logger.warn('Mongoose default connection disconnected', {
        lastDisconnected: new Date().toISOString()
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        logger.info('Mongoose connection closed through app termination', {
            shutdownTime: new date().toISOString(),
            uptime: process.uptime()
        });
    } catch (err) {
        logger.error('Failed to close MongoDB connection during shutdown', {
            error: err.message,
            stack: err.stack
        });
        process.exit(1);
    }
});