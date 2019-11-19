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
    console.log('Published', packet.payload); // eslint-disable-line no-console
});

server.on('ready', () => {
    console.log(`> MQTT server running on mqtt://localhost:${moscaSettings.port}`); // eslint-disable-line no-console
});
