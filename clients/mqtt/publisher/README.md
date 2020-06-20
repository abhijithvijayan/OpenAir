## ESP8266 MQTT Publisher

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

Download from <https://www.arduino.cc/download_handler.php>

### 2. MQTTBox

Download from <http://workswithweb.com/html/mqttbox/downloads.html>

<hr />

### 3. Arduino IDE Addon Clients & Libraries

#### 1. AsyncMqttClient

<http://marvinroger.viewdocs.io/async-mqtt-client/1.-Getting-started/>
<!-- 
#### 1. PubSubClient
1. Read the documentation [here](https://pubsubclient.knolleary.net/api.html)
2.  Download latest release from https://github.com/knolleary/pubsubclient/releases/latest
3. Go to `Sketch -> Include Library -> Add .zip library` and chose the downloaded `.zip` file
4. Edit `/home/$USER/Arduino/libaries/pubsubclient-2.7/src/PubSubClient.cpp`

	1. Add under `Line#460`
		```
		// custom
		boolean PubSubClient::publish(const char *topic, const char *payload, unsigned int length)
		{
				return publish(topic, (const uint8_t *)payload, length, false);
		}
		```
5. Edit `/home/$USER/Arduino/libaries/pubsubclient-2.7/src/PubSubClient.h`

	1. Edit `Line#30`
		```
		// custom
		#define MQTT_MAX_PACKET_SIZE 512
		```
	2. Add under `Line#153`
		```
		// custom
		boolean publish(const char *topic, const char *payload, unsigned int length);
		``` -->

#### 2. ESP8266 Addon

1. In your Arduino IDE, go to `File > Preferences`
2. Enter `https://arduino.esp8266.com/stable/package_esp8266com_index.json` into the `Additional Boards Manager URLs` field. Then, click the `OK` button
3. Open the Boards Manager. Go to `Tools > Board > Boards Manager`
4. Search for `ESP8266` and press install button for the `ESP8266 by ESP8266 Community`
5. It should be installed after a few seconds.
6. Choose board as `NodeMCU 1.0` and set erase to `ALL FLASH CONTENTS`. That’s it.

#### 3. OpenAirSensors

Make a softlink to libraries path

```
ln -s ~/workspace/OpenAir/lib/OpenAirSensors ~/Arduino/libraries
```

#### 4. Other Libraries

1. Open the Libraries Manager. Go to `Tools > Manage Libraries`
2. Search for `ArduinoJson` and press install

<hr />

### 4. Allow Port on Firewall

Open port TCP:1883 on firewall

```
sudo ufw allow 1883
```

### 6. Fix Permissions

<https://playground.arduino.cc/Linux/All/#Permission>

### 7. VSCODE

1. Install `arduino` extension
2. Follow [this](https://github.com/microsoft/vscode-arduino/issues/791#issuecomment-476089760) instruction to fix arduino path

<hr />

### Sample JSON Output

How to compute the JsonDocument size?
<https://arduinojson.org/v6/assistant/>

```
{
  "name": "College of Engineering, Adoor",
  "location": {
    "type": "point",
    "coordinates": {
      "lat": "9.1323982",
      "lng": "76.7159223"
    }
  },
  "readings": [
    {
      "id": "sensor-mq-001",
      "type": "mq2",
      "unit": "PPM",
      "compound": "smoke",
      "value": 16.10838
    },
    {
      "id": "sensor-mq-002",
      "type": "mq7",
      "unit": "PPM",
      "compound": "CO",
      "value": 5.274735
    },
    {
      "id": "sensor-mq-003",
      "type": "mq135",
      "unit": "PPM",
      "compound": "NOx",
      "value": 0
    }
  ]
}
```
