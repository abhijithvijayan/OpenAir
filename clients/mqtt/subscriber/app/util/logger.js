const { createLogger, format, transports } = require('winston');

const logLevel = () => {
    if (process.env.NODE_ENV === 'production') {
        return 'info';
    }
    return 'debug';
};

const logger = createLogger({
    format: format.combine(
        // Use these two instead for JSON format
        // format.timestamp(),
        // format.json()
        format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS' }),
        format.printf(info => {
            return `[${info.timestamp}] [${info.level.toUpperCase()}] ${info.message}`;
        })
    ),
    transports: [new transports.Console({ level: logLevel() })],
});

module.exports = logger;
