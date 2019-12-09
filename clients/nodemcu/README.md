## ESP8266 MQTT Client

This sketch demonstrates the capabilities of the pubsub library in combination
with the ESP8266 board/library.

It connects to an MQTT server then:

- publishes "hello world" to the topic "sensors" every two seconds
- subscribes to the topic "testing", printing out any messages
  it receives. NB - it assumes the received payloads are strings not binary
- If the first character of the topic "testing" is an 1, switch ON the ESP Led,
  else switch it off

It will reconnect to the server if the connection is lost using a blocking
reconnect function. See the 'mqtt_reconnect_nonblocking' example for how to
achieve the same result without blocking the main loop.

## Getting Started

1. Check if mqqt server is running and listening for connections with

```
netstat -an4 | grep 1883 | grep LISTEN
```

2. Update Credentials

   1. Get RPi Local IP with
      ```
      hostname -I
      ```
   1. Update WiFi ssid & password

3. Flash to NodeMCU

<hr />

## Pre-requisites

### 1. Arduno IDE

Download from https://www.arduino.cc/download_handler.php

### 2. MQTTBox

Download from http://workswithweb.com/html/mqttbox/downloads.html

### 3. Arduino Client for MQTT

Downloade latest release from https://github.com/knolleary/pubsubclient/releases/latest

### 4. ESP8266 Addon for IDE

1. In your Arduino IDE, go to File> Preferences
2. Enter `https://arduino.esp8266.com/stable/package_esp8266com_index.json` into the `Additional Boards Manager URLs` field. Then, click the `OK` button
3. Open the Boards Manager. Go to `Tools > Board > Boards Manager`
4. Search for `ESP8266` and press install button for the `SP8266 by ESP8266 Community`
5. That’s it. It should be installed after a few seconds.

### 5. Allow Port on Firewall

Open port TCP:1883 on firewall

```
sudo ufw allow 1883
```

### 6. Fix Permissions

https://playground.arduino.cc/Linux/All/#Permission

<hr />
