## MQTT Broker / Client

### Prerequisites

- Docker

The Raspberry Pi will act as

- a **mqtt broker** (server)

  - for the **NodeMCU (mqtt publisher client)**

- a **mqtt client** (subscriber)
  - to **subscribe** to all the **topics** and also **fetch** the published data(by NodeMCU) forwarded by **mqtt server (RPi itself)**.

## Working

1. RPi Will run the
   - mqtt server(broker) instance
   - mqtt client(subscriber) instance
   - websocket server instance
   - dashboard instance
2. mqtt client(subscriber) tries to make a secure connection to the mqtt server(broker). On success, it will subscribe to all topics
3. mqtt server, on accepting client connections, pushes the client info to the Websocket
4. mqtt server, on receiving data(periodically) from NodeMCU(mqtt publisher client), forwards the topics to the respective subscribers
5. mqtt client(subscriber), on receiving this data, parses it and
   - pushes to the websocket (for the dashboard) for monitoring them
   - transfer to the IoT cloud(backend)
6. Dashboard instance(Websocket client) will show information of all nodes of network in real-time
