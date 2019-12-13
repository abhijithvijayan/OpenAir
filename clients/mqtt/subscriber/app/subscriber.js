const mqtt = require('mqtt');
require('dotenv').config();

const serverIP = process.env.MQTT_SERVER_IP;

// Connect to mqtt server
const mqttSubscriber = mqtt.connect(serverIP);

/**
 *  Emitted on successful (re)connection (i.e. connack rc=0).
 */
mqttSubscriber.on('connect', function() {
    mqttSubscriber.subscribe('sensors');

    console.log('subscribed'); // eslint-disable-line no-console
});

/**
 *  Emitted when the client receives a publish packet
 */
mqttSubscriber.on('message', function(topic, message) {
    const context = message.toString();

    console.log(context); // eslint-disable-line no-console
});

/**
 *  Emitted when a reconnect starts.
 */
mqttSubscriber.on('reconnect', function() {
    console.log('Reconnecting...'); // eslint-disable-line no-console
});

/**
 *  Emitted when the client cannot connect (i.e. connack rc != 0) or when a parsing error occurs.
 */
mqttSubscriber.on('error', function(err) {
    console.log(err.message); // eslint-disable-line no-console
});

/**
 *  Emitted after a disconnection.
 */
mqttSubscriber.on('close', function(err) {
    console.log('Disconnected'); // eslint-disable-line no-console
});

/**
 *  Emitted after receiving disconnect packet from broker.
 */
mqttSubscriber.on('disconnect', function(err) {
    console.log('Broker sent disconnect packet'); // eslint-disable-line no-console
});

/**
 *  Emitted when the client goes offline.
 */
mqttSubscriber.on('offline', function(err) {
    console.log('Client is now offline'); // eslint-disable-line no-console
});
