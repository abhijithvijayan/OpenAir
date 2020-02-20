/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const mqtt = require('mqtt');

const mqttServerAddress = process.env.MQTT_SERVER_ADDRESS;
const username = process.env.MQTT_AUTH_ID;
const password = process.env.MQTT_AUTH_PASSWORD;

const publisherId = `PUBLISHER_${Math.random()
    .toString(16)
    .substr(2, 8)}`;

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
mqttPublisher.on('connect', function() {
    setInterval(function() {
        const sampleData = {
            name: 'Adoor, Kerala, India',
            type: 'Town',
            coordinates: { lat: '9.151239499999999', lng: '76.73076630000003' },
            air: [
                { id: '........', type: 'mq2', compound: 'smoke', value: 3.130643 },
                { id: '........', type: 'mq7', compound: 'CO', value: 0.122789 },
                { id: '........', type: 'mq135', compound: 'NO2', value: 0 },
            ],
        };

        mqttPublisher.publish('openair/places', JSON.stringify(sampleData));

        console.log('Message Sent'); // eslint-disable-line no-console
    }, 10000);
});

/**
 *  Emitted when a reconnect starts.
 */
mqttPublisher.on('reconnect', function() {
    console.log('Reconnecting...'); // eslint-disable-line no-console
});

/**
 *  Emitted when the client cannot connect (i.e. connack rc != 0) or when a parsing error occurs.
 */
mqttPublisher.on('error', function(err) {
    console.log(err.message); // eslint-disable-line no-console
});

/**
 *  Emitted after a disconnection.
 */
mqttPublisher.on('close', function() {
    console.log('Disconnected'); // eslint-disable-line no-console
});

/**
 *  Emitted after receiving disconnect packet from broker.
 */
mqttPublisher.on('disconnect', function(packet) {
    console.log('Broker sent disconnect packet', packet); // eslint-disable-line no-console
});

/**
 *  Emitted when the client goes offline.
 */
mqttPublisher.on('offline', function() {
    console.log('Client is now offline'); // eslint-disable-line no-console
});
