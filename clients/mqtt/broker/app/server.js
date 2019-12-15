const aedes = require('aedes');
const net = require('net');
const io = require('socket.io');

const { SOCKET_SERVER_PORT, MQTT_AUTH_ID, MQTT_AUTH_PASSWORD } = require('./config/secrets.js');

const startServer = () => {
    const port = 1883;

    /**
     *  Create broker instance
     */
    const broker = aedes();
    const server = net.createServer(broker.handle);

    /**
     *  Socket Sever: Listen to clients
     */
    const eventSocket = io.listen(SOCKET_SERVER_PORT);

    /**
     *  mqtt Authentication Middleware
     *  Called when a new client connects
     *
     *  Return code: 4 - Bad user name or password
     */
    broker.authenticate = function(client, userId, password, callback) {
        const authorized = userId === MQTT_AUTH_ID && password.toString() === MQTT_AUTH_PASSWORD;

        if (authorized) {
            client.user = userId;
        }

        const error = new Error('Auth error');
        error.returnCode = 4;

        callback(authorized ? null : error, authorized);
    };

    /**
     *  Fired when a mqtt client connects
     */
    broker.on('client', function(client) {
        const cId = client ? client.id : null;
        console.log(`> Client Connected: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console

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
        });
    });

    /**
     *  Fired when a message is received
     */
    broker.on('publish', async function(packet, client) {
        // eslint-disable-next-line no-console
        console.log(
            `> Client \x1b[31m${client ? client.id : `BROKER_${broker.id}`}\x1b[0m has published`,
            packet.payload.toString(),
            'on',
            packet.topic
        );

        // Sending to all clients
        eventSocket.emit('hello', 'can you hear me?', 1, 2, 'abc');
    });

    /**
     *  Fired when a client disconnects
     */
    broker.on('clientDisconnect', function(client) {
        const cId = client ? client.id : null;
        console.log(`> Client Disconnected: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
    });

    /**
     *  Fired when client subscribes to topic
     */
    broker.on('subscribe', function(subscriptions, client) {
        // eslint-disable-next-line no-console
        console.log(
            `> MQTT client \x1b[32m${client ? client.id : client}\x1b[0m subscribed to topics: ${subscriptions
                .map(s => {
                    return s.topic;
                })
                .join('\n')}`
        );
    });

    /**
     *  Fired when client unsubscribes to topic
     */
    broker.on('unsubscribe', function(subscriptions, client) {
        // eslint-disable-next-line no-console
        console.log(
            `> MQTT client \x1b[32m${client ? client.id : client}\x1b[0m unsubscribed to topics: ${subscriptions.join(
                '\n'
            )}`
        );
    });

    broker.on('closed', function() {
        console.log(`> Broker Closed:`); // eslint-disable-line no-console
    });

    /**
     *  Fired when client errors
     */
    broker.on('clientError', function(client, err) {
        const cId = client ? client.id : null;
        console.log(`> Client Errored: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
    });

    /**
     *  Fired when client-connection errors & no clientId attached
     */
    broker.on('connectionError', function(client, err) {
        const cId = client ? client.id : null;
        console.log(`> Connection Errored: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
    });

    /**
     *  Fired when client keepalive times out
     */
    broker.on('keepaliveTimeout', function(client) {
        const cId = client ? client.id : null;
        console.log(`> Client Timed out: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
    });

    /**
     *  Fired when client ping
     */
    broker.on('ping', async function(packet, client) {
        const cId = client ? client.id : null;
        console.log(`> Client Pings: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
    });

    /**
     *  Fired when the mqtt server is ready
     */
    server.listen(port, function() {
        console.log(`> MQTT server running on mqtt://localhost:${port}`); // eslint-disable-line no-console
    });
};

module.exports = startServer;
