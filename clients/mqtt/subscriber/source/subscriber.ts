import mqtt from 'mqtt';
import {v4} from 'uuid';

import {
  MQTT_SERVER_ADDRESS,
  MQTT_AUTH_ID,
  MQTT_AUTH_PASSWORD,
} from './config/secrets';
import api from './api';
import {ApiRoutes} from './api/constants';
import {generateAqiDataPacket, PollutionDataProperties} from './parser';

type SuccessResponse = {
  data: {
    message: string;
    status: boolean;
  };
  response: {
    statusCode: number;
    statusText: string;
  };
};

const startSubscriber = (): void => {
  const subscriberId = `SUBSCRIBER_${v4()}`;

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
  const mqttClient: mqtt.MqttClient = mqtt.connect(
    MQTT_SERVER_ADDRESS,
    mqttOptions
  );

  /**
   *  Emitted on successful mqtt (re)connection
   */
  mqttClient.on('connect', (): void => {
    // Subscribe to all topics here
    mqttClient.subscribe('openair/places');

    console.log('subscribed'); // eslint-disable-line no-console
  });

  /**
   *  Emitted when the mqtt client receives a published packet
   */
  mqttClient.on(
    'message',
    async (_topic, message, _packet): Promise<void> => {
      const context: string = message.toString();

      // console.log(context, packet); // eslint-disable-line no-console

      /**
       *  ToDo: based on type of topic
       *  Communicate to IoT Server
       */
      const aqiDataPacket: PollutionDataProperties = generateAqiDataPacket(
        context
      );
      // ToDo: inject timestamp to data packet
      try {
        const response: any = await api({
          key: ApiRoutes.SAVE_PLACE_DATA,
          params: aqiDataPacket,
        });

        const {data}: SuccessResponse = response.data;
        console.log(data.message);
      } catch (err) {
        console.log(`API Errored: ${err}`);
      }
    }
  );

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
