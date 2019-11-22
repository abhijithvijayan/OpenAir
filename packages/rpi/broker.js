const mosca = require('mosca');

const moscaSettings = {
    port: 1883, // PORT to run mosca on
};

// Start mosca
const server = new mosca.Server(moscaSettings);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id); // eslint-disable-line no-console
});

// fired when a message is received
server.on('published', function(packet, client) {
    console.log(packet.payload.toString('utf-8')); // eslint-disable-line no-console
});

// fired when a client subscribes to a topic
server.on('subscribed', function(topic, client) {
    console.log('subscribed : ', topic); // eslint-disable-line no-console
});

// fired when a client unsubscribes to a topic
server.on('unsubscribed', function(topic, client) {
    console.log('unsubscribed : ', topic); // eslint-disable-line no-console
});

// fired when a client is disconnecting
server.on('clientDisconnecting', function(client) {
    console.log('clientDisconnecting : ', client.id); // eslint-disable-line no-console
});

// fired when a client is disconnected
server.on('clientDisconnected', function(client) {
    console.log('clientDisconnected : ', client.id); // eslint-disable-line no-console
});

server.on('ready', () => {
    console.log(`> MQTT server running on mqtt://localhost:${moscaSettings.port}`); // eslint-disable-line no-console
});
