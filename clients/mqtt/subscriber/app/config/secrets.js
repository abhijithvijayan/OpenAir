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
exports.MQTT_SERVER_ADDRESS = process.env.MQTT_SERVER_ADDRESS || 'mqtt://localhost:1883';

/**
 *  Array of required fields
 */
const requiredSecrets = ['SOCKET_SERVER_PORT', 'MQTT_SERVER_ADDRESS'];

for (const secret of requiredSecrets) {
    if (!process.env[secret]) {
        logger.error(`Env variable ${secret} is missing.`);
        process.exit(1);
    }
}
