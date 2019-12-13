require('dotenv').config({ path: '.env' });
const aedes = require('aedes');
const net = require('net');

const port = 1883;
const broker = aedes();
const server = net.createServer(broker.handle);

/**
 *  called when a new client connects
 *
 *  Return codes
 *   1 - Unacceptable protocol version
 *   2 - Identifier rejected
 *   3 - Server unavailable
 *   4 - Bad user name or password
 */
broker.authenticate = function(client, userId, password, callback) {
    const mqttAuthId = process.env.MQTT_AUTH_ID;
    const mqttAuthPassword = process.env.MQTT_AUTH_PASSWORD;

    const authorized = userId === mqttAuthId && password === mqttAuthPassword;

    if (authorized) {
        client.user = userId;
    }

    const error = new Error('Auth error');
    error.returnCode = 4;

    callback(authorized ? null : error, authorized);
};

/**
 *  fired when a client connects
 */
broker.on('client', function(client) {
    const cId = client ? client.id : null;
    console.log(`> Client Connected: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
});

/**
 *  fired when client receives all offline messages
 */
broker.on('clientReady', function(client) {
    const cId = client ? client.id : null;
    console.log(`> Client Ready: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
});

/**
 *  fired when a client disconnects
 */
broker.on('clientDisconnect', function(client) {
    const cId = client ? client.id : null;
    console.log(`> Client Disconnected: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
});

/**
 *  fired when client errors
 */
broker.on('clientError', function(client, err) {
    const cId = client ? client.id : null;
    console.log(`> Client Errored: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
});

/**
 *  fired when client-connection errors & no clientId attached
 */
broker.on('connectionError', function(client, err) {
    const cId = client ? client.id : null;
    console.log(`> Connection Errored: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
});

/**
 *  fired when client keepalive times out
 */
broker.on('keepaliveTimeout', function(client) {
    const cId = client ? client.id : null;
    console.log(`> Client Timed out: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
});

/**
 *  fired when a message is received
 */
broker.on('publish', async function(packet, client) {
    // eslint-disable-next-line no-console
    console.log(
        `> Client \x1b[31m${client ? client.id : `BROKER_${broker.id}`}\x1b[0m has published`,
        packet.payload.toString(),
        'on',
        packet.topic
    );
});

/**
 *  fired when client ping
 */
broker.on('ping', async function(packet, client) {
    const cId = client ? client.id : null;
    console.log(`> Client Pings: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
});

/**
 *  fired when client subscribes to topic
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
 *  fired when client unsubscribes to topic
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
 *  fired when the mqtt server is ready
 */
server.listen(port, function() {
    console.log(`> MQTT server running on mqtt://localhost:${port}`); // eslint-disable-line no-console
});
