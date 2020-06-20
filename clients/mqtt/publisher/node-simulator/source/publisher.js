/**
 *  @openair/publisher(simulator)
 *
 *  @author   abhijithvijayan <abhijithvijayan.in>
 *  @license  GNU GPLv3 License
 */

/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const mqtt = require('mqtt');
const {v4: uuidv4} = require('uuid');

const mqttServerAddress = process.env.MQTT_SERVER_ADDRESS;
const username = process.env.MQTT_AUTH_ID;
const password = process.env.MQTT_AUTH_PASSWORD;

const publisherId = `PUBLISHER_${uuidv4()}`;

/**
 *  Connection Options
 */
const mqttOptions = {
  clientId: publisherId,
  username,
  password,
  keepalive: 60,
  reconnectPeriod: 2000,
  encoding: 'utf8',
  clean: true,
};

/**
 *  Connect to mqtt server
 */
const mqttPublisher = mqtt.connect(mqttServerAddress, mqttOptions);

/**
 *  Emitted on successful (re)connection (i.e. connack rc=0).
 */
mqttPublisher.on('connect', () => {
  mqttPublisher.publish('test/echo', 'hello world');

  setInterval(() => {
    const sampleDataPacket = {
      name: 'College of Engineering, Adoor',
      location: {
        type: 'point',
        coordinates: {lat: '9.1323982', lng: '76.7159223'},
      },
      readings: [
        {
          id: 'sensor-mq-001',
          type: 'mq2',
          unit: 'PPM',
          compound: 'smoke',
          value: 16.10838,
        },
        {
          id: 'sensor-mq-002',
          type: 'mq7',
          unit: 'PPM',
          compound: 'CO',
          value: 5.274735,
        },
        {
          id: 'sensor-mq-003',
          type: 'mq135',
          unit: 'PPM',
          compound: 'NOx',
          value: 0,
        },
      ],
    };

    mqttPublisher.publish('openair/places', JSON.stringify(sampleDataPacket));

    console.log('Packet Published'); // eslint-disable-line no-console
  }, 20000);
});

/**
 *  Emitted when a reconnect starts.
 */
mqttPublisher.on('reconnect', () => {
  console.log('Reconnecting...'); // eslint-disable-line no-console
});

/**
 *  Emitted when the client cannot connect (i.e. connack rc != 0) or when a parsing error occurs.
 */
mqttPublisher.on('error', (err) => {
  console.log(err.message); // eslint-disable-line no-console
});

/**
 *  Emitted after a disconnection.
 */
mqttPublisher.on('close', () => {
  console.log('Disconnected'); // eslint-disable-line no-console
});

/**
 *  Emitted after receiving disconnect packet from broker.
 */
mqttPublisher.on('disconnect', (packet) => {
  console.log('Broker sent disconnect packet', packet); // eslint-disable-line no-console
});

/**
 *  Emitted when the client goes offline.
 */
mqttPublisher.on('offline', () => {
  console.log('Client is now offline'); // eslint-disable-line no-console
});
