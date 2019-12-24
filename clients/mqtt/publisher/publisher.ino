/**
 *  author:       abhijithvijayan
 *  created:      23 Dec 2019
 *  title:        CD74HC4051 Analog / Digital Multiplexing with MQTT Publisher Client
 *
 *  This sketch reads analog values from 3 of the 8 multiplexer pins
 *  and publish the sensor data as JSON to a topic using mqtt protocol with async-mqtt-client
 *
 *  The following pins must be connected:
 *
 *  Digital Pin 0 -> S0
 *  Digital Pin 1 -> S1
 *  Digital Pin 2 -> S2
 *  Digital Pin 4 -> E
 *  Analog Pin A0 -> SIG(Z)
 *  Output Pin Y0 -> a0(mq-2)
 *  Output Pin Y1 -> a1(mq-7)
 *  Output Pin Y2 -> a2(mq-135)
 */

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
#define SENSOR_SWITCH_DELAY 10000                    // 10sec
#define SINGLE_SENSOR_CONSECUTIVE_READING_DELAY 1000 // 1sec
#define SERIAL_DEBUG_PORT 115200

// Sensors
#define SENSOR_1 "MQ-2"
#define SENSOR_2 "MQ-7"
#define SENSOR_3 "MQ-135"
#define UNKNOWN "unknown"

// Output Pins
#define MUX_A D0
#define MUX_B D1
#define MUX_C D2

// Mux analog / digital signal pin
#define ANALOG_INPUT 0

// Mux channel select pins
#define setPin0 16 // GPIO 16 (D0 on NodeMCU)
#define setPin1 5  // GPIO 5  (D1 on NodeMCU)
#define setPin2 4  // GPIO 4  (D2 on NodeMCU)

// ----------------------------------------------------- //
// ----------------------------------------------------- //
// ----------------------------------------------------- //

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
 *  Get sensor reading
 */
int getSensorReading(int channel)
{
  /**
   *  use the first three bits of the channel number to set the channel select pins
   *
   *  channel 2 -> bits 0 1 0
   *  S0 -> 0, S1 -> 1, S2 -> 0 => Y2
   */
  digitalWrite(setPin0, bitRead(channel, 0));
  digitalWrite(setPin1, bitRead(channel, 1));
  digitalWrite(setPin2, bitRead(channel, 2));

  // read from the selected mux channel
  int sensorValue = analogRead(ANALOG_INPUT);

  // return the received analog value
  return sensorValue;
}

/**
 *  Read 10 consecutive values & return average
 */
int getSensorAverageReading(int channel)
{
  int readingValue = 0;

  for (int j = 0; j < 10; ++j)
  {
    delay(SINGLE_SENSOR_CONSECUTIVE_READING_DELAY);
    // sum up analog reading
    readingValue += getSensorReading(channel);
  }

  return readingValue / 10;
}

/**
 *  Return Sensor name
 */
char *getSensorName(int id)
{
  if (id == 0)
  {
    return SENSOR_1;
  }
  if (id == 1)
  {
    return SENSOR_2;
  }
  if (id == 2)
  {
    return SENSOR_3;
  }

  return UNKNOWN;
}

/**
 *  Get Readings and Store as array of objects (as String)
 */
String generateAirQualityDataBody()
{
  StaticJsonDocument<300> json_doc;

  // Iterate through all used channels
  for (int channel = 0; channel < 3; ++channel)
  {
    // char sensorName[10];

    // Get sensor reading
    int sensorValue = getSensorAverageReading(channel);
    char *sensorName = getSensorName(channel);

    // create an object
    JsonObject sensorObject = json_doc.createNestedObject();
    // set sensor fields to object
    sensorObject["id"] = channel;
    sensorObject["type"] = sensorName;
    sensorObject["value"] = sensorValue;

    // delay next channel read
    delay(SENSOR_SWITCH_DELAY);
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
char *generateDataFormat(String airDataBuffer)
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
  StaticJsonDocument<592> raw_json_data;

  // push static location info
  raw_json_data["name"] = LOCATION_NAME;
  raw_json_data["type"] = LOCATION_TYPE;
  // creates an object with key `coordinates`
  JsonObject coordinates = raw_json_data.createNestedObject("coordinates");
  coordinates["lat"] = LATITUDE;
  coordinates["lng"] = LONGITUDE;

  // Print the memory usage for metadata
  Serial.print("Metadata Packet Size: ");
  Serial.println(raw_json_data.memoryUsage());

  // store air data(array of objects) into `air` key
  raw_json_data["air"] = json_str_arr.as<JsonArray>();

  // Print the memory usage for message packet
  Serial.print("Message Packet Size: ");
  Serial.println(raw_json_data.memoryUsage());

  // Declare a buffer to hold the result
  char dataString[592];
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

  // Define output pins for MUX
  pinMode(MUX_A, OUTPUT);
  pinMode(MUX_B, OUTPUT);
  pinMode(MUX_C, OUTPUT);

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
  // ToDo: Don't read data if failed to establish mqtt connection
  long now = millis();
  if (now - lastReconnectAttempt > DATA_PUBLISHING_DELAY)
  {
    lastReconnectAttempt = now;

    // Turn the LED on by making the voltage LOW
    digitalWrite(BUILTIN_LED, LOW);

    String airData = generateAirQualityDataBody();
    char *rawDataString = generateDataFormat(airData);
    unsigned int jsonStrLength = strlen(rawDataString);

    Serial.println();
    // publish data
    if (mqttClient.publish(TOPIC_LOCATION, 1, true, rawDataString, jsonStrLength))
    {
      Serial.println("Success. Published gas readings");
    }
    else
    {
      Serial.println("Error. Failed to publish gas readings");
    }
    Serial.println();

    // Turn the LED off by making the voltage HIGH
    digitalWrite(BUILTIN_LED, HIGH);
  }
}
