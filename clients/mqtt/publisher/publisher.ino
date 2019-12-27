/**
 *  author:       abhijithvijayan
 *  created:      23 Dec 2019
 *  title:        CD74HC4051 Analog / Digital Multiplexing with MQTT Publisher Client
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

#define TOPIC_LOCATION "openair/location"
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
#define MESSAGE_MAX_PACKET_SIZE 592
#define SENSOR_DATA_MAX_PACKET_SIZE 300

// MUX channel select pins
#define SELECTOR_PIN_0 5 // GPIO 5 (D1 on NodeMCU)
#define SELECTOR_PIN_1 4 // GPIO 4 (D2 on NodeMCU)
#define SELECTOR_PIN_2 0 // GPIO 0 (D3 on NodeMCU)

// ----------------------------------------------------- //
// ----------------------------------------------------- //
// ----------------------------------------------------- //

Mux BREAKOUT_8_CHANNEL_MUX(SELECTOR_PIN_0, SELECTOR_PIN_1, SELECTOR_PIN_2);

// channel number: y0, y1, y2
AnalogSensor sensor1("GS_jk3DS8h", "mq2", "gas", 0);
AnalogSensor sensor2("GS_4fFjSc4", "mq7", "gas", 1);
AnalogSensor sensor3("GS_kgDD75h", "mq135", "gas", 2);

// create collection
SensorCollection gas_sensors("gas_sensors", "OpenAir Gas-Sensors Collection");

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
 *  Read 10 consecutive values & return average
 */
int getSensorAverageReading(Sensor *sensor)
{
  int readingValue = 0;

  for (int j = 0; j < SINGLE_SENSOR_CONSECUTIVE_READING_COUNT; ++j)
  {
    // sum up analog reading
    readingValue += sensor->read();

    delay(SINGLE_SENSOR_CONSECUTIVE_READING_DELAY);
  }

  return readingValue / 10;
}

/**
 *  Get Readings and Store as array of objects (as String)
 */
String generateAirQualityDataBody()
{
  StaticJsonDocument<SENSOR_DATA_MAX_PACKET_SIZE> json_doc;

  int sensorsCount = gas_sensors.getSize();
  for (int index = 0; index < sensorsCount; ++index)
  {
    Sensor *sensor = gas_sensors.getSensor(index);

    // switch channel
    BREAKOUT_8_CHANNEL_MUX.switchChannel(sensor->getPin());

    // Get sensor reading
    int sensorReading = getSensorAverageReading(sensor);
    char *sensorName = sensor->getName();
    char *sensorId = sensor->getId();

    // create an object
    JsonObject sensorObject = json_doc.createNestedObject();

    // set sensor fields to object
    sensorObject["id"] = sensorId;
    sensorObject["type"] = sensorName;
    sensorObject["value"] = sensorReading;
  }

  // write back json to serial monitor
  serializeJsonPretty(json_doc, Serial);
  Serial.println();

  // Cast minified json to buffer
  String airDataBuffer = json_doc.as<String>();

  // Print the memory usage
  Serial.print("Gas Data Packet Size: ");
  Serial.println(json_doc.memoryUsage());

  return airDataBuffer;
}

/**
 *  Append Air Data to Static GeoData
 */
char *generatePubMessageBody(String airDataBuffer)
{
  // parse JSON to store array of objects
  const size_t STR_ARR_CAPACITY = JSON_ARRAY_SIZE(3) + 3 * JSON_OBJECT_SIZE(3) + 70;
  StaticJsonDocument<STR_ARR_CAPACITY> json_str_arr;

  // Parse the air data input JSON
  DeserializationError err = deserializeJson(json_str_arr, airDataBuffer);

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
  char dataString[MESSAGE_MAX_PACKET_SIZE];
  // Cast json to buffer
  serializeJson(raw_json_data, dataString, sizeof(dataString));

  return dataString;
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

  // add sensors to collection
  gas_sensors.addSensor(sensor1);
  gas_sensors.addSensor(sensor2);
  gas_sensors.addSensor(sensor3);

  // setup output pins for mux
  BREAKOUT_8_CHANNEL_MUX.setup();

  // initialize & connect to WiFi
  connectToWifi();

  // delay before initial sensor reading
  delay(INITIAL_PRE_HEAT_TIME);
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

      String airData = generateAirQualityDataBody();
      char *rawDataString = generatePubMessageBody(airData);
      unsigned int jsonStrLength = strlen(rawDataString);

      Serial.println();
      // publish json data to topic
      if (mqttClient.connected() && mqttClient.publish(TOPIC_LOCATION, 1, true, rawDataString, jsonStrLength))
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
