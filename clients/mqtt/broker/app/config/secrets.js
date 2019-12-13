const fs = require('fs');
const dotenv = require('dotenv');

const logger = require('../util/logger');

if (!fs.existsSync('.env')) {
    logger.info('No .env file found, looking for variables in environment.');
} else {
    /**
     *  Load environment variables from .env file
     */
    dotenv.config({ path: '.env' });
}

/**
 *  Export all the env vars here
 */
exports.PRODUCTION = 'production';
exports.ENVIRONMENT = process.env.NODE_ENV || 'development';
exports.SOCKET_SERVER_PORT = process.env.SOCKET_SERVER_PORT || 8888;
exports.MQTT_AUTH_ID = process.env.MQTT_AUTH_ID;
exports.MQTT_AUTH_PASSWORD = process.env.MQTT_AUTH_PASSWORD;

/**
 *  Array of required fields
 */
const requiredSecrets = ['SOCKET_SERVER_PORT'];

for (const secret of requiredSecrets) {
    if (!process.env[secret]) {
        logger.error(`Env variable ${secret} is missing.`);
        process.exit(1);
    }
}
