const mqtt = require('mqtt');

const serverIP = process.env.MQTT_SERVER_IP;

// Connect to mqtt server
const mqttPublisher = mqtt.connect(serverIP);

mqttPublisher.on('connect', function() {
    setInterval(function() {
        mqttPublisher.publish('sensors', 'Hello from mqtt publishers');

        console.log('Message Sent'); // eslint-disable-line no-console
    }, 5000);
});
