require('dotenv').config({ path: '../.env' });
const mqtt = require('mqtt');
const io = require('socket.io');

const startServer = () => {
    const socketPort = process.env.SOCKET_SERVER_PORT;
    const mqttServerAddress = process.env.MQTT_SERVER_ADDRESS;

    const subscriberId = `SUBSCRIBER_${Math.random()
        .toString(16)
        .substr(2, 8)}`;

    /**
     *  Socket Sever: Listen to port
     */
    const eventSocket = io.listen(socketPort);

    /**
     *  Connection Options
     */
    const mqttOptions = {
        clientId: subscriberId,
    };

    /**
     *  Connect to mqtt server
     *  ToDo: Pass auth options
     */
    const mqttClient = mqtt.connect(mqttServerAddress, mqttOptions);

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
         *  1. Communicate to IoT Server
         *  2. Push to websocket clients
         */

        // Sending to all clients
        eventSocket.emit('hello', 'can you hear me?', 1, 2, 'abc');
    });

    /**
     *  Emitted on socket connection with client
     */
    eventSocket.on('connect', ioClient => {
        // send something to the client
        eventSocket.to(ioClient.id).emit('nice game', "let's play a game");

        ioClient.on('some-event', data => {
            console.log(data); // eslint-disable-line no-console

            mqttClient.publish('topic', 'value');
        });
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

module.exports = startServer;
