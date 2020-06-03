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

const startServer = (): void => {
  const port = 1883;

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
   *  mqtt Authentication Middleware
   *  Called when a new client connects
   *
   *  Return code: 4 - Bad user name or password
   */

  /**
   *  Fired when a mqtt client connects
   */
  broker.on('client', (client: Client) => {
    const cId = client ? client.id : null;
    console.log(`> MQTT Client Connected: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console

    // Sending to all clients
    eventSocket.emit('echo', 'hello can you hear me?', 1, 2, 'abc');
  });

  /**
   *  Emitted on socket connection with client
   */
  eventSocket.on('connect', (ioClient: io.Socket) => {
    console.log(`> Socket Client Connected: \x1b[33m$${ioClient.id}\x1b[0m`); // eslint-disable-line no-console
    // send something to the client
    eventSocket.to(ioClient.id).emit('nice', "let's play a game");

    ioClient.on('some-event', (data): void => {
      console.log(data); // eslint-disable-line no-console
    });
  });

  /**
   *  Fired when a message is received
   */
  broker.on('publish', async (packet, client: Client) => {
    // eslint-disable-next-line no-console
    console.log(
      `> Client \x1b[31m${
        client ? client.id : `BROKER_${broker}`
      }\x1b[0m has published`,
      packet.payload.toString(),
      'on',
      packet.topic
    );

    // Sending to all clients
    eventSocket.emit('echo', 'something is happening?', 1, 2, 'abc');
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
    const cId = client ? client.id : null;
    console.log(`> Client Pings: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
  });

  /**
   *  Fired when the mqtt server is ready
   */
  server.listen(port, (): void => {
    console.log(`> MQTT server running on mqtt://localhost:${port}`); // eslint-disable-line no-console
  });
};

export default startServer;
