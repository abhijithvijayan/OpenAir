const mosca = require('mosca');

const { authenticate, authorizePublish, authorizeSubscribe } = require('./auth');

const moscaSettings = {
    port: 1883, // PORT to run mosca on
};

// Start mosca
const server = new mosca.Server(moscaSettings);

server.on('clientConnected', function(client) {
    console.log(`client connected: ${client.id}`); // eslint-disable-line no-console
});

/**
 *  fired when a message is received
 */
server.on('published', function(packet, client) {
    // console.log('Why is this called on subscribing!!');
    console.log(packet.payload.toString('utf-8')); // eslint-disable-line no-console
});

/**
 *  fired when a client subscribes to a topic
 */
server.on('subscribed', function(topic, client) {
    console.log(`${client.id} subscribed to ${topic}`); // eslint-disable-line no-console
});

/**
 *  fired when a client unsubscribes to a topic
 */
server.on('unsubscribed', function(topic, client) {
    console.log(`${client.id} unsubscribed to ${topic}`); // eslint-disable-line no-console
});

/**
 *  fired when a client is disconnecting
 */
server.on('clientDisconnecting', function(client) {
    console.log('clientDisconnecting : ', client.id); // eslint-disable-line no-console
});

/**
 *  fired when a client is disconnected
 */
server.on('clientDisconnected', function(client) {
    console.log('clientDisconnected : ', client.id); // eslint-disable-line no-console
});

/**
 *  ToDo: Use Custom auth handler
 *  https://github.com/mcollina/mosca/wiki/Authentication-&-Authorization#using-moscas-standalone-authorizer-with-an-embedded-mosca
 */
function setupAuth() {
    server.authenticate = authenticate;
    server.authorizePublish = authorizePublish;
    server.authorizeSubscribe = authorizeSubscribe;
}

/**
 *  fired when the mqtt server is ready
 */
server.on('ready', () => {
    console.log(`> MQTT server running on mqtt://localhost:${moscaSettings.port}`); // eslint-disable-line no-console

    // setupAuth();
});
