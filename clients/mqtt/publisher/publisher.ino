/**
 *  author:       abhijithvijayan
 *  created:      23 Dec 2019
 *  title:        CD74HC4051 Analog / Digital Multiplexing with MQTT Publisher Client in ESP8266 NodeMCU
 *
 *  This sketch reads analog values from 3 sensors and publish
 *  the sensor data as JSON to a topic using mqtt protocol with async-mqtt-client
 *
 *  The following pins must be connected(customize accordingly):
 *
 *  Digital Pin 1 -> Mux S0
 *  Digital Pin 2 -> Mux S1
 *  Digital Pin 3 -> Mux S2
 *  Digital Pin 4 -> Mux E
 *  Analog Pin A0 -> Mux SIG(Z)
 *  Mux Output Pin Y0 -> a0(mq-2)
 *  Mux Output Pin Y1 -> a1(mq-7)
 *  Mux Output Pin Y2 -> a2(mq-135)
 */

#include <OpenAirSensors.h>
#include <ESP8266WiFi.h>
#include <string.h>
#include <Ticker.h>          // https://github.com/me-no-dev/ESPAsyncTCP
#include <AsyncMqttClient.h> // https://github.com/marvinroger/async-mqtt-client
#include <ArduinoJson.h>     // https://github.com/bblanchon/ArduinoJson

// MQTT Device Credentials
#define MQTT_DEVICE_ID "........"
#define CLIENT_AUTH_ID "........"
#define CLIENT_AUTH_CREDENTIAL "........"
#define LATITUDE "........"
#define LONGITUDE "........"
#define LOCATION_NAME "........"
#define LOCATION_TYPE "........"

#define TOPIC_LOCATION "openair/places"
#define TOPIC_ECHO "test/echo"

// Network
#define WIFI_SSID "........"
#define WIFI_PASSWORD "........"

// MQTT Server Credentials
#define MQTT_HOST IPAddress(0, 0, 0, 0)
#define MQTT_PORT 1883

// General
#define INITIAL_PRE_HEAT_TIME 318000                 // 5.3min
#define DATA_PUBLISHING_DELAY 180000                 // 3min
#define SINGLE_SENSOR_CONSECUTIVE_READING_DELAY 1000 // 1sec
#define SINGLE_SENSOR_CONSECUTIVE_READING_COUNT 10   // 10 readings per sensor
#define SERIAL_DEBUG_PORT 115200

// Data Packets Memory allocation
#define MESSAGE_MAX_PACKET_SIZE 656
#define SENSOR_DATA_MAX_PACKET_SIZE 400
#define STRING_DUPLICATION_PACKET_SIZE 192

// MUX channel select pins
#define SELECTOR_PIN_0 5 // GPIO 5 (D1 on NodeMCU)
#define SELECTOR_PIN_1 4 // GPIO 4 (D2 on NodeMCU)
#define SELECTOR_PIN_2 0 // GPIO 0 (D3 on NodeMCU)

// ----------------------------------------------------- //
// ----------------------------------------------------- //
// ----------------------------------------------------- //

Mux Breakout_8_Channel_Mux(SELECTOR_PIN_0, SELECTOR_PIN_1, SELECTOR_PIN_2);

// id, name, category, pin(channel number: y0, y1, y2, ...), type
MQSensor MQ2("........", "mq2", "gas", 0, 2);
MQSensor MQ7("........", "mq7", "gas", 1, 7);
MQSensor MQ135("........", "mq135", "gas", 2, 135);

// create sensor collection
SensorCollection gasSensors("gas-sensors", "OpenAir Gas-Sensors Collection");

AsyncMqttClient mqttClient;
Ticker mqttReconnectTimer;

WiFiEventHandler wifiConnectHandler;
WiFiEventHandler wifiDisconnectHandler;
Ticker wifiReconnectTimer;

long lastReconnectAttempt = 0;

/**
 *  Handle WiFi Connectivity
 */
void connectToWifi()
{
  Serial.println();
  Serial.print("[WiFi] Connecting to ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

/**
 *  WiFi Connect event handler
 */
void onWifiConnect(const WiFiEventStationModeGotIP &event)
{
  Serial.println("");
  Serial.println("[WiFi] Connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // initialize mqtt connection
  connectToMqtt();
}

/**
 *  WiFi Disconnect event handler
 */
void onWifiDisconnect(const WiFiEventStationModeDisconnected &event)
{
  Serial.println("[WiFi] Disconnected.");

  // ensure to not reconnect to MQTT while reconnecting to Wi-Fi
  mqttReconnectTimer.detach();
  wifiReconnectTimer.once(2, connectToWifi);
}

/**
 *  Handle MQTT Server Connectivity
 */
void connectToMqtt()
{
  Serial.print("[MQTT] Attempting MQTT connection...");
  Serial.println();

  mqttClient.connect();
}

/**
 *  MQTT Connect event handler
 */
void onMqttConnect(bool sessionPresent)
{
  Serial.println("[MQTT] Connected to server");
  Serial.print("Session present: ");
  Serial.println(sessionPresent);

  // Once connected, publish an announcement...
  uint16_t packetIdPub1 = mqttClient.publish(TOPIC_ECHO, 1, true, "hello world");
  Serial.print("[MQTT] Publishing at QoS 1, packetId: ");
  Serial.println(packetIdPub1);
}

/**
 *  MQTT Disconnect event handler
 */
void onMqttDisconnect(AsyncMqttClientDisconnectReason reason)
{
  Serial.println("[MQTT] Disconnected from MQTT.");

  if (WiFi.isConnected())
  {
    mqttReconnectTimer.once(2, connectToMqtt);
  }
}

/**
 *  MQTT Publish acknowledged event handler
 */
void onMqttPublish(uint16_t packetId)
{
  Serial.println("[MQTT] Publish acknowledged.");
  Serial.print("[MQTT] packetId: ");
  Serial.println(packetId);
}

/**
 *  Get Readings and Store as array of objects (as String)
 */
String generateGasDataPacket()
{
  StaticJsonDocument<SENSOR_DATA_MAX_PACKET_SIZE> json_doc;

  int sensorsCount = gasSensors.getSize();
  for (int id = 0; id < sensorsCount; ++id)
  {
    Sensor *sensor = gasSensors.getSensor(id);

    char *sensorName = sensor->getName();
    char *sensorId = sensor->getId();

    // switch channel in mux
    Breakout_8_Channel_Mux.switchChannel(sensor->getPin());

   // create an object
    JsonObject sensorObject = json_doc.createNestedObject();

    // set sensor fields to object
    sensorObject["id"] = sensorId;
    sensorObject["type"] = sensorName;

    if (sensorName == "mq2") {
      sensorObject["compound"] = "smoke";
      sensorObject["value"] = MQ2.getSensorReading();
    }
    else if (sensorName == "mq7") {
      sensorObject["compound"] = "CO";
      sensorObject["value"] = MQ7.getSensorReading();
    }
    else if (sensorName == "mq135") {
      sensorObject["compound"] = "NO2";
      sensorObject["value"] = MQ135.getSensorReading();
    }
  }

  // write back json to serial monitor
  serializeJsonPretty(json_doc, Serial);
  Serial.println();

  // Cast minified json to buffer
  String airDataPacketBuffer = json_doc.as<String>();

  // Print the memory usage
  Serial.print("Gas Data Packet Size: ");
  Serial.println(json_doc.memoryUsage());

  return airDataPacketBuffer;
}

/**
 *  Append Air Data to Geotagging data
 */
char *generateMqttPacket(String airDataPacketBuffer)
{
  // parse JSON to store array of objects(air data)
  const size_t STR_ARR_CAPACITY = JSON_ARRAY_SIZE(3) + 3 * JSON_OBJECT_SIZE(4) + STRING_DUPLICATION_PACKET_SIZE;
  StaticJsonDocument<STR_ARR_CAPACITY> json_str_arr;

  // Parse the air data input JSON
  DeserializationError err = deserializeJson(json_str_arr, airDataPacketBuffer);

  if (err)
  {
    Serial.print(F("Error. Failed to parse json. deserializeJson() returned "));
    Serial.println(err.c_str());
    // return;
  }

  // json to store message to be published
  StaticJsonDocument<MESSAGE_MAX_PACKET_SIZE> raw_json_data;

  // push static location info
  raw_json_data["name"] = LOCATION_NAME;
  raw_json_data["type"] = LOCATION_TYPE;
  // creates an object with key `coordinates`
  JsonObject coordinates = raw_json_data.createNestedObject("coordinates");
  coordinates["lat"] = LATITUDE;
  coordinates["lng"] = LONGITUDE;
  // ToDo: attach timestamp

  // Print the memory usage for metadata
  Serial.print("Metadata Packet Size: ");
  Serial.println(raw_json_data.memoryUsage());

  // store air data(array of objects) into `air` key
  raw_json_data["air"] = json_str_arr.as<JsonArray>();

  // Print the memory usage for message packet
  Serial.print("Message Packet Size: ");
  Serial.println(raw_json_data.memoryUsage());

  // Declare a buffer to hold the result
  char jsonPacket[MESSAGE_MAX_PACKET_SIZE];
  // Cast json to buffer
  serializeJson(raw_json_data, jsonPacket, sizeof(jsonPacket));

  return jsonPacket;
}

/**
 *  `setup()` function
 *   will only run once, after each powerup or reset of the board.
 */
void setup()
{
  pinMode(BUILTIN_LED, OUTPUT); // Initialize the BUILTIN_LED pin as an output

  // initialize serial for debugging
  Serial.begin(SERIAL_DEBUG_PORT);

  wifiConnectHandler = WiFi.onStationModeGotIP(onWifiConnect);
  wifiDisconnectHandler = WiFi.onStationModeDisconnected(onWifiDisconnect);

  // configure client instance
  mqttClient.onConnect(onMqttConnect);
  mqttClient.onDisconnect(onMqttDisconnect);
  mqttClient.onPublish(onMqttPublish);
  // mqttClient.setClientId(MQTT_DEVICE_ID);
  // mqttClient.setKeepAlive(120);
  // mqttClient.setCleanSession(true);
  mqttClient.setCredentials(CLIENT_AUTH_ID, CLIENT_AUTH_CREDENTIAL);
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);

  // set up mux output pins
  Breakout_8_Channel_Mux.setup();

  // add sensors to collection
  gasSensors.addSensor(MQ2);
  gasSensors.addSensor(MQ7);
  gasSensors.addSensor(MQ135);

  // initialize & connect to WiFi
  connectToWifi();

  // ToDo: This won't work as using async mqtt server(Fix this)
  // delay before initial sensor reading
  delay(INITIAL_PRE_HEAT_TIME);

  Serial.println("***************************");
  Serial.println("*******Setting Up**********");
  Serial.println("***************************");
  Serial.println();

  // set sensor voltage
  gasSensors.setup(Breakout_8_Channel_Mux);

  Serial.println("***************************");
  Serial.println("*******Calibrating*********");
  Serial.println("***************************");
  Serial.println();

  // Calibrate sensors
  gasSensors.calibrate(Breakout_8_Channel_Mux);
}

/**
 *  Iterating Function
 */
void loop()
{
  if (mqttClient.connected())
  {
    long now = millis();

    if (now - lastReconnectAttempt > DATA_PUBLISHING_DELAY)
    {
      lastReconnectAttempt = now;

      // Turn the LED on by making the voltage LOW
      digitalWrite(BUILTIN_LED, LOW);

      // generate JSON air quality data
      String airDataPacket = generateGasDataPacket();
      // combine data with geotagging data
      char *mqttJsonPacket = generateMqttPacket(airDataPacket);

      unsigned int packetLength = strlen(mqttJsonPacket);

      Serial.println();
      // publish json data to topic
      if (mqttClient.connected() && mqttClient.publish(TOPIC_LOCATION, 1, true, mqttJsonPacket, packetLength))
      {
        Serial.println("Success. Published sensor readings");
      }
      else
      {
        Serial.println("Error. Failed to publish sensor readings");
      }
      Serial.println();

      // Turn the LED off by making the voltage HIGH
      digitalWrite(BUILTIN_LED, HIGH);
    }
  }
}
