import * as mqtt from 'mqtt';

import { MQTT_SERVER_ADDRESS, MQTT_AUTH_ID, MQTT_AUTH_PASSWORD } from './config/secrets';

const startSubscriber = (): void => {
    const subscriberId = `SUBSCRIBER_${Math.random()
        .toString(16)
        .substr(2, 8)}`;

    /**
     *  Connection Options
     */
    const mqttOptions: mqtt.IClientOptions = {
        clientId: subscriberId,
        username: MQTT_AUTH_ID,
        password: MQTT_AUTH_PASSWORD,
        keepalive: 60,
        reconnectPeriod: 1000,
        clean: true,
    };

    /**
     *  Connect to mqtt server
     */
    const mqttClient: mqtt.MqttClient = mqtt.connect(MQTT_SERVER_ADDRESS, mqttOptions);

    /**
     *  Emitted on successful mqtt (re)connection
     */
    mqttClient.on('connect', (): void => {
        // Subscribe to all topics
        mqttClient.subscribe('sensors');

        console.log('subscribed'); // eslint-disable-line no-console
    });

    /**
     *  Emitted when the mqtt client receives a published packet
     */
    mqttClient.on('message', (_topic, message, packet): void => {
        const context: string = message.toString();

        console.log(context, packet); // eslint-disable-line no-console

        /**
         *  ToDo: based on type of topic
         *  Communicate to IoT Server
         */
    });

    /**
     *  Emitted when a mqtt reconnect starts.
     */
    mqttClient.on('reconnect', (): void => {
        console.log('Reconnecting...'); // eslint-disable-line no-console
    });

    /**
     *  Emitted when mqtt client cannot connect or when a parsing error occurs.
     */
    mqttClient.on('error', (err: mqtt.OnErrorCallback): void => {
        console.log(err); // eslint-disable-line no-console
    });

    /**
     *  Emitted after a mqtt disconnection.
     */
    mqttClient.on('close', (): void => {
        console.log('Disconnected'); // eslint-disable-line no-console
    });

    /**
     *  Emitted after receiving disconnect packet from mqtt broker.
     */
    mqttClient.on('disconnect', (packet: mqtt.OnPacketCallback): void => {
        console.log('Broker sent disconnect packet'); // eslint-disable-line no-console
        console.log(packet);
    });

    /**
     *  Emitted when the mqtt client goes offline.
     */
    mqttClient.on('offline', (): void => {
        console.log('Client is now offline'); // eslint-disable-line no-console
    });
};

export default startSubscriber;
