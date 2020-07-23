/* eslint-disable @typescript-eslint/camelcase */
import io from 'socket.io';
import aedes, {
  Aedes,
  Client,
  AuthenticateError,
  AuthenticateHandler,
} from 'aedes';
import net from 'net';

import {
  SOCKET_SERVER_PORT,
  MQTT_AUTH_ID,
  MQTT_AUTH_PASSWORD,
} from './config/secrets';

enum ClientType {
  PUBLISHER_CODE = 'T1',
  SUBSCRIBER_CODE = 'T2',
  PUBLISHER = 'PUBLISHER',
  SUBSCRIBER = 'SUBSCRIBER',
  UNKNOWN = 'UNKNOWN',
}

type MqttConnectedClient = {
  id: string;
  uuid: string;
  prefix: string;
  type: string;
  category: string;
  connected_at: number;
  closed: boolean;
  connecting: boolean;
  connected: boolean;
  clean: boolean;
  version: number;
};

type DataPacket = {
  name: string;
  location: {
    type: string;
    coordinates: {lat: string; lng: string};
  };
  readings: {
    id: string;
    type: string;
    unit: string;
    compound: string;
    value: number;
  }[];
  timestamp: number;
};

const startServer = (): void => {
  const port = 1883;

  /**
   *  mqtt Authentication Middleware
   *  Called when a new client connects
   *
   *  Return code: 4 - Bad user name or password
   */

  const authenticate: AuthenticateHandler = (
    _client,
    username,
    password,
    callback
  ): void => {
    const authorized =
      username === MQTT_AUTH_ID && password.toString() === MQTT_AUTH_PASSWORD;

    // eslint-disable-next-line no-empty
    if (authorized) {
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err: any = new Error('Auth error');
    err.returnCode = 4; // BAD_USERNAME_OR_PASSWORD

    callback(authorized ? null : (err as AuthenticateError), authorized);
  };

  /**
   *  Create broker instance
   */
  const broker: Aedes = aedes({authenticate});
  const server: net.Server = net.createServer(broker.handle);

  /**
   *  Socket Sever: Listen to clients
   */
  const eventSocket: io.Server = io.listen(SOCKET_SERVER_PORT);

  /**
   *  Fired when a mqtt client connects
   */
  broker.on('client', (client: Client) => {
    if (client) {
      const {
        id: clientId,
        connected,
        connecting,
        closed,
        version,
        clean,
      } = client;
      console.log(`> MQTT Client Connected: \x1b[33m${clientId}\x1b[0m`); // eslint-disable-line no-console
      /**
       *  CLIENT_T1_ prefix for Publisher
       *  CLIENT_T2_ prefix for Subscriber
       *
       *  eg: CLIENT_T2_ee9c1708-6c7e-457c-989f-d635236740c8
       */

      const [clientPrefix, clientTypeCode, clientUUID] = clientId.split('_');
      const clientCategory: string =
        (clientTypeCode === ClientType.PUBLISHER_CODE &&
          ClientType.PUBLISHER) ||
        (clientTypeCode === ClientType.SUBSCRIBER_CODE &&
          ClientType.SUBSCRIBER) ||
        ClientType.UNKNOWN;

      const connectedClient: MqttConnectedClient = {
        id: clientId,
        uuid: clientUUID,
        prefix: clientPrefix,
        type: clientTypeCode,
        category: clientCategory,
        connected_at: new Date().getTime(),
        closed,
        connecting,
        connected,
        clean,
        version,
      };

      // Sending to all websocket clients
      eventSocket.emit('mqtt-client-connects', connectedClient);
    }
  });

  /**
   *  Emitted on socket connection with client
   */
  eventSocket.on('connect', (ioClient: io.Socket) => {
    console.log(`> Socket Client Connected: \x1b[33m$${ioClient.id}\x1b[0m`); // eslint-disable-line no-console
    // send something to the client
    eventSocket.to(ioClient.id).emit('echo', 'you listening?');

    ioClient.on('some-event', (data): void => {
      console.log(data); // eslint-disable-line no-console
    });
  });

  /**
   *  Fired when a message is received
   */
  broker.on('publish', async (packet, client: Client) => {
    const id = client ? client.id : `BROKER-${broker.id}`;
    // eslint-disable-next-line no-console
    console.log(
      `> Client \x1b[31m${id}\x1b[0m has published on ${packet.topic}`
    );

    if (client) {
      console.log(packet.topic);

      // According to topic, emit to websocket
      if (packet.topic === 'openair/places') {
        const dataPacket: DataPacket = {
          ...JSON.parse(packet.payload.toString()),
          timestamp: new Date().getTime(),
        };

        // Sending to all clients
        eventSocket.emit('mqtt-client-publishes', {
          clientId: client.id,
          data: dataPacket,
        });
      }
    }
  });

  /**
   *  Fired when a client disconnects
   */
  broker.on('clientDisconnect', (client: Client): void => {
    const cId = client ? client.id : null;
    console.log(`> Client Disconnected: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
  });

  /**
   *  Fired when client subscribes to topic
   */
  broker.on('subscribe', (subscriptions, client: Client): void => {
    // eslint-disable-next-line no-console
    console.log(
      `> MQTT client \x1b[32m${
        client ? client.id : client
      }\x1b[0m subscribed to topics: ${
        Array.isArray(subscriptions) &&
        subscriptions
          .map((s) => {
            return s.topic;
          })
          .join('\n')
      }`
    );
  });

  /**
   *  Fired when client unsubscribes to topic
   */
  broker.on('unsubscribe', (subscriptions, client): void => {
    // eslint-disable-next-line no-console
    console.log(
      `> MQTT client \x1b[32m${
        client ? client.id : client
      }\x1b[0m unsubscribed to topics: ${
        Array.isArray(subscriptions) && subscriptions.join('\n')
      }`
    );
  });

  broker.on('closed', (): void => {
    console.log(`> Broker Closed:`); // eslint-disable-line no-console
  });

  /**
   *  Fired when client errors
   */
  broker.on('clientError', (client, err): void => {
    const cId = client ? client.id : null;
    console.log(`> Client Errored: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
    console.log(err);
  });

  /**
   *  Fired when client-connection errors & no clientId attached
   */
  broker.on('connectionError', (client, err): void => {
    const cId = client ? client.id : null;
    console.log(`> Connection Errored: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
    console.log(err);
  });

  /**
   *  Fired when client keepalive times out
   */
  broker.on('keepaliveTimeout', (client): void => {
    const cId = client ? client.id : null;
    console.log(`> Client Timed out: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
  });

  /**
   *  Fired when client ping
   */
  broker.on('ping', (_packet, client): void => {
    if (client) {
      const {
        id: clientId,
        connected,
        connecting,
        closed,
        version,
        clean,
      } = client;
      console.log(`> MQTT Client Pings: \x1b[33m${clientId}\x1b[0m`); // eslint-disable-line no-console

      const [clientPrefix, clientTypeCode, clientUUID] = clientId.split('_');
      const clientCategory: string =
        (clientTypeCode === ClientType.PUBLISHER_CODE &&
          ClientType.PUBLISHER) ||
        (clientTypeCode === ClientType.SUBSCRIBER_CODE &&
          ClientType.SUBSCRIBER) ||
        ClientType.UNKNOWN;

      const connectedClient: MqttConnectedClient = {
        id: clientId,
        uuid: clientUUID,
        prefix: clientPrefix,
        type: clientTypeCode,
        category: clientCategory,
        connected_at: new Date().getTime(),
        closed,
        connecting,
        connected,
        clean,
        version,
      };

      // Sending to all websocket clients
      eventSocket.emit('mqtt-client-pings', connectedClient);
    }
  });

  /**
   *  Fired when the mqtt server is ready
   */
  server.listen(port, (): void => {
    console.log(`> MQTT server running on mqtt://localhost:${port}`); // eslint-disable-line no-console
  });
};

export default startServer;
