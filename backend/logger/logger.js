require ('winston-daily-rotate-file');
require ('winston-mongodb');
const { format, createLogger, transports, error, warn, log } = require('winston');
const { combine, timestamp, label, printf, prettyPrint } = format;
const CATEGORY = "MTG app logs";

const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
    return `${timestamp} [${level}]: ${message} ${Object.keys(metadata).length ? JSON.stringify(metadata) : ''}`;
});

// Logger creation
const logger = createLogger({
    format: combine(
        label({ label: CATEGORY}),
        timestamp(),
        prettyPrint(),
        customFormat
    ),
    transports: [
        new transports.Console({
            level: 'debug',
            handleExceptions: true
        }),

        new transports.DailyRotateFile({
            filename: 'logs/application-%DATE%.log,',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            level: 'info'
        }),

        new transports.MongoDB({
            level: 'error',
            db: process.env.MONGODB_URI,
            options: {useUnifiedTopology: true},
            collection: 'logs',
            format: format.json()
        })
    ],
    exitOnError: false
})

module.exports = {
    error: (message, metadata) => logger.error(message, metadata),
    warn: (message, metadata) => logger.warn(message, metadata),
    info: (message, metadata) => logger.info(message, metadata),
    debug: (message, metadata) => logger.debug(message, metadata),
    logger
};