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
 *  Output Pins Y0, Y1, Y1
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

#define TOPIC_LOCATION "location"
#define TOPIC_ECHO "echo"

// Network
#define WIFI_SSID "........"
#define WIFI_PASSWORD "........"

// MQTT Server Credentials
#define MQTT_HOST IPAddress(0, 0, 0, 0)
#define MQTT_PORT 1883

// General
#define SERIAL_DEBUG_PORT 115200
#define WIFI_INITIAL_CONN_DELAY 10
#define WIFI_CONN_RETRY_DELAY 500
#define MQTT_CONN_RETRY_DELAY 5000
#define SENSORS_DATA_READING_DELAY 10000
#define SENSOR_SWITCH_DELAY 10000
#define SINGLE_SENSOR_CONSECUTIVE_READING_DELAY 1000

// Output Pins
#define MUX_A D0
#define MUX_B D1
#define MUX_C D2

// Mux analog / digital signal pin
#define ANALOG_INPUT 0

// Mux channel select pins
#define setPin0 16 // GPIO 16 (D0 on NodeMCU)
#define setPin1 5  // GPIO 5 (D1 on NodeMCU)
#define setPin2 4  // GPIO 4 (D2 on NodeMCU)

// ----------------------------------------------------- //
// ----------------------------------------------------- //
// ----------------------------------------------------- //

AsyncMqttClient mqttClient;
Ticker mqttReconnectTimer;

WiFiEventHandler wifiConnectHandler;
WiFiEventHandler wifiDisconnectHandler;
Ticker wifiReconnectTimer;

long lastReconnectAttempt = 0;

void connectToWifi()
{
  Serial.println();
  Serial.print("[WiFi] Connecting to ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void onWifiConnect(const WiFiEventStationModeGotIP &event)
{
  Serial.println("");
  Serial.println("[WiFi] Connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  // initialize mqtt connection
  connectToMqtt();
}

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
  // ToDo: Use ESP.getChipId() & authentication

  mqttClient.connect();
}

void onMqttConnect(bool sessionPresent)
{
  Serial.println("[MQTT] Connected to server");
  Serial.print("[MQTT] Session present: ");
  Serial.println(sessionPresent);

  // Once connected, publish an announcement...
  uint16_t packetIdPub1 = mqttClient.publish(TOPIC_ECHO, 1, true, "hello world");
  Serial.print("[MQTT] Publishing at QoS 1, packetId: ");
  Serial.println(packetIdPub1);
}

void onMqttDisconnect(AsyncMqttClientDisconnectReason reason)
{
  Serial.println("[MQTT] Disconnected from MQTT.");

  if (WiFi.isConnected())
  {
    mqttReconnectTimer.once(2, connectToMqtt);
  }
}

void onMqttPublish(uint16_t packetId)
{
  Serial.println("[MQTT] Publish acknowledged.");
  Serial.print("  packetId: ");
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
 *  Get Readings and Store as array of objects (as String)
 */
String generateAirQualityDataBody()
{
  const size_t CAPACITY = JSON_ARRAY_SIZE(3) + 3 * JSON_OBJECT_SIZE(3);
  StaticJsonDocument<CAPACITY> doc;

  // Iterate through all used channels
  for (int channel = 0; channel < 3; ++channel)
  {
    // Get sensor reading
    int sensorValue = getSensorAverageReading(channel);

    // create an object
    JsonObject sensorObject = doc.createNestedObject();
    // set sensor fields to object
    sensorObject["id"] = channel;
    // sensorObject["type"] = "mq2"; // switch according to channel#
    sensorObject["value"] = sensorValue;

    // delay next channel read
    delay(SENSOR_SWITCH_DELAY);
  }

  // write back json to serial monitor
  serializeJsonPretty(doc, Serial);
  Serial.println();

  //  Cast JSON to a String
  String airDataBufferString = doc.as<String>();

  // string
  return airDataBufferString;
}

/**
 *  Append Air Data to Static GeoData
 */
char *generateDataFormat(String airDataBufferString)
{
  const size_t CAPACITY = JSON_ARRAY_SIZE(3) + JSON_OBJECT_SIZE(2) + 3 * JSON_OBJECT_SIZE(3) + JSON_OBJECT_SIZE(4);
  StaticJsonDocument<CAPACITY> rawJsonData;

  // push static location info
  rawJsonData["name"] = LOCATION_NAME;
  rawJsonData["type"] = LOCATION_TYPE;
  // creates an object with key `coordinates`
  JsonObject coordinates = rawJsonData.createNestedObject("coordinates");
  coordinates["lat"] = LATITUDE;
  coordinates["lng"] = LONGITUDE;

  // parse JSON to store array of objects
  const size_t STR_ARR_CAPACITY = JSON_ARRAY_SIZE(3) + 3 * JSON_OBJECT_SIZE(3);
  StaticJsonDocument<STR_ARR_CAPACITY> jsonAirData;
  deserializeJson(jsonAirData, airDataBufferString);

  // store air data(array of objects) into `air` key
  rawJsonData["air"] = jsonAirData;

  /*
   * Cast Json to a String for publishing
   * https://github.com/knolleary/pubsubclient/issues/258#issuecomment-379083118
   */
  char dataString[500]; // limit 512 for mqtt publisher
  serializeJson(rawJsonData, dataString);

  return dataString;
}

/**
 *  `setup()` function
 *  will only run once, after each powerup or reset of the board.
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
  mqttClient.setCredentials(CLIENT_AUTH_ID, CLIENT_AUTH_CREDENTIAL);
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);

  // Define output pins for MUX
  pinMode(MUX_A, OUTPUT);
  pinMode(MUX_B, OUTPUT);
  pinMode(MUX_C, OUTPUT);

  // initialize & connect to WiFi
  connectToWifi();

  // ToDo: delay for 5min before initial sensor reading
}

/**
 *  Iterating Function
 */
void loop()
{
  long now = millis();
  if (now - lastReconnectAttempt > SENSORS_DATA_READING_DELAY)
  {
    lastReconnectAttempt = now;

    // Turn the LED on by making the voltage LOW
    digitalWrite(BUILTIN_LED, LOW);

    Serial.println();
    Serial.print("Publish message: ");

    String airData = generateAirQualityDataBody();
    char *rawDataString = generateDataFormat(airData);
    unsigned int jsonStrLength = strlen(rawDataString);

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
