import * as aedes from 'aedes';
import * as net from 'net';
import * as io from 'socket.io';

const { SOCKET_SERVER_PORT, MQTT_AUTH_ID, MQTT_AUTH_PASSWORD } = require('./config/secrets.js');

const startServer = (): void => {
    const port: number = 1883;

    /**
     *  Create broker instance
     */
    const broker: aedes.Aedes = aedes();
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
    broker.authenticate = function(_client, userId, password, callback): void {
        const authorized = userId === MQTT_AUTH_ID && password.toString() === MQTT_AUTH_PASSWORD;

        if (authorized) {
        }

        const err: any = new Error('Auth error');
        err.returnCode = aedes.AuthErrorCode.BAD_USERNAME_OR_PASSWORD;

        callback(authorized ? null : (err as aedes.AuthenticateError), authorized);
    };

    /**
     *  Fired when a mqtt client connects
     */
    broker.on('client', function(client: aedes.Client) {
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
    broker.on('publish', async function(packet, client: aedes.Client) {
        // eslint-disable-next-line no-console
        console.log(
            `> Client \x1b[31m${client ? client.id : `BROKER_${broker}`}\x1b[0m has published`,
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
    broker.on('clientDisconnect', function(client: aedes.Client): void {
        const cId = client ? client.id : null;
        console.log(`> Client Disconnected: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
    });

    /**
     *  Fired when client subscribes to topic
     */
    broker.on('subscribe', function(subscriptions, client: aedes.Client): void {
        // eslint-disable-next-line no-console
        console.log(
            `> MQTT client \x1b[32m${client ? client.id : client}\x1b[0m subscribed to topics: ${Array.isArray(
                subscriptions
            ) &&
                subscriptions
                    .map(s => {
                        return s.topic;
                    })
                    .join('\n')}`
        );
    });

    /**
     *  Fired when client unsubscribes to topic
     */
    broker.on('unsubscribe', function(subscriptions, client): void {
        // eslint-disable-next-line no-console
        console.log(
            `> MQTT client \x1b[32m${client ? client.id : client}\x1b[0m unsubscribed to topics: ${Array.isArray(
                subscriptions
            ) && subscriptions.join('\n')}`
        );
    });

    broker.on('closed', function(): void {
        console.log(`> Broker Closed:`); // eslint-disable-line no-console
    });

    /**
     *  Fired when client errors
     */
    broker.on('clientError', function(client, err): void {
        const cId = client ? client.id : null;
        console.log(`> Client Errored: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
        console.log(err);
    });

    /**
     *  Fired when client-connection errors & no clientId attached
     */
    broker.on('connectionError', function(client, err): void {
        const cId = client ? client.id : null;
        console.log(`> Connection Errored: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
        console.log(err);
    });

    /**
     *  Fired when client keepalive times out
     */
    broker.on('keepaliveTimeout', function(client): void {
        const cId = client ? client.id : null;
        console.log(`> Client Timed out: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
    });

    /**
     *  Fired when client ping
     */
    broker.on('ping', function(_packet, client): void {
        const cId = client ? client.id : null;
        console.log(`> Client Pings: \x1b[33m${cId}\x1b[0m`); // eslint-disable-line no-console
    });

    /**
     *  Fired when the mqtt server is ready
     */
    server.listen(port, function(): void {
        console.log(`> MQTT server running on mqtt://localhost:${port}`); // eslint-disable-line no-console
    });
};

export default startServer;
