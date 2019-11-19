const mqtt = require('mqtt');

const serverIP = process.env.MQTT_SERVER_IP;

// Connect to mqtt server
const mqttClient = mqtt.connect(serverIP, { clientId: 'OpenAir' });

mqttClient.on('connect', function() {
    mqttClient.subscribe('sensors');

    console.log('subscribed'); // eslint-disable-line no-console
});

mqttClient.on('message', function(topic, message) {
    const context = message.toString();

    console.log(context); // eslint-disable-line no-console
});
