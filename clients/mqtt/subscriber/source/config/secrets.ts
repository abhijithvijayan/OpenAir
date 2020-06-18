/* eslint-disable @typescript-eslint/no-namespace */
import fs from 'fs';
import dotenv from 'dotenv';

import logger from '../util/logger';

if (!fs.existsSync('.env')) {
  logger.info('No .env file found, looking for variables in environment.');
} else {
  // Load environment variables from .env file
  dotenv.config({path: '.env'});
}

// typings for env vars
declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      MQTT_SERVER_ADDRESS: string;
      MQTT_AUTH_ID: string;
      MQTT_AUTH_PASSWORD: string;
      API_SERVER_URL: string;
    }
  }
}

/**
 *  Export all the env vars here
 */
export const PRODUCTION = 'production';
export const ENVIRONMENT: string = process.env.NODE_ENV || 'development';
export const {MQTT_SERVER_ADDRESS = 'mqtt://localhost:1883'} = process.env;
export const {MQTT_AUTH_ID} = process.env;
export const {MQTT_AUTH_PASSWORD} = process.env;

/**
 *  Array of required fields
 */
const requiredSecrets: string[] = [
  'MQTT_AUTH_ID',
  'MQTT_AUTH_PASSWORD',
  'API_SERVER_URL',
];

for (const secret of requiredSecrets) {
  if (!process.env[secret]) {
    logger.error(`Env variable ${secret} is missing.`);
    process.exit(1);
  }
}
