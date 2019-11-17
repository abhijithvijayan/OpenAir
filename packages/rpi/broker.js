const mosca = require('mosca');

const moscaSettings = {
    port: 1883, // PORT to run mosca on
};

// Start mosca
const server = new mosca.Server(moscaSettings);

server.on('ready', () => {
    console.log(`> MQTT server running on mqtt://localhost:${moscaSettings.port}`); // eslint-disable-line no-console
});
