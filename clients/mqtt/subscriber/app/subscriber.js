const mqtt = require('mqtt');

const { MQTT_SERVER_ADDRESS, MQTT_AUTH_ID, MQTT_AUTH_PASSWORD } = require('./config/secrets');

const startSubscriber = () => {
    const subscriberId = `SUBSCRIBER_${Math.random()
        .toString(16)
        .substr(2, 8)}`;

    /**
     *  Connection Options
     */
    const mqttOptions = {
        clientId: subscriberId,
        username: MQTT_AUTH_ID,
        password: MQTT_AUTH_PASSWORD,
        keepalive: 60,
        reconnectPeriod: 1000,
        encoding: 'utf8',
        clean: true,
    };

    /**
     *  Connect to mqtt server
     */
    const mqttClient = mqtt.connect(MQTT_SERVER_ADDRESS, mqttOptions);

    /**
     *  Emitted on successful mqtt (re)connection
     */
    mqttClient.on('connect', () => {
        // Subscribe to all topics
        mqttClient.subscribe('sensors');

        console.log('subscribed'); // eslint-disable-line no-console
    });

    /**
     *  Emitted when the mqtt client receives a published packet
     */
    mqttClient.on('message', (topic, message) => {
        const context = message.toString();

        console.log(context); // eslint-disable-line no-console

        /**
         *  ToDo: based on type of topic
         *  Communicate to IoT Server
         */
    });

    /**
     *  Emitted when a mqtt reconnect starts.
     */
    mqttClient.on('reconnect', function() {
        console.log('Reconnecting...'); // eslint-disable-line no-console
    });

    /**
     *  Emitted when mqtt client cannot connect or when a parsing error occurs.
     */
    mqttClient.on('error', function(err) {
        console.log(err.message); // eslint-disable-line no-console
    });

    /**
     *  Emitted after a mqtt disconnection.
     */
    mqttClient.on('close', function(err) {
        console.log('Disconnected'); // eslint-disable-line no-console
    });

    /**
     *  Emitted after receiving disconnect packet from mqtt broker.
     */
    mqttClient.on('disconnect', function(err) {
        console.log('Broker sent disconnect packet'); // eslint-disable-line no-console
    });

    /**
     *  Emitted when the mqtt client goes offline.
     */
    mqttClient.on('offline', function(err) {
        console.log('Client is now offline'); // eslint-disable-line no-console
    });
};

module.exports = startSubscriber;
