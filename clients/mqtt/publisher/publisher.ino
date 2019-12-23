/**
 *  author:       abhijithvijayan
 *  created:      23 Dec 2019
 *  title:        CD74HC4051 Analog / Digital Multiplexing with MQTT Publisher Client
 *
 *  This sketch reads analog values from 3 of the 8 multiplexer pins
 *  and publish the sensor data to a topic using mqtt protocol with PubSubClient
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
#include <PubSubClient.h> // https://github.com/knolleary/pubsubclient
#include <ArduinoJson.h>  // https://github.com/bblanchon/ArduinoJson

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
const char *ssid = "........";
const char *password = "........";

// MQTT Server Credentials
IPAddress mqtt_server_ip(0, 0, 0, 0);
#define MQTT_SERVER_PORT 1883

// General
#define WIFI_INITIAL_CONN_DELAY 10
#define WIFI_CONN_RETRY_DELAY 500
#define MQTT_CONN_RETRY_DELAY 5000
#define SENSOR_DATA_READING_DELAY 10000
#define SENSOR_SWITCH_DELAY 1000
#define SERIAL_DEBUG_PORT 115200

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

long lastMsg = 0;

// Creates an uninitialised client instance.
WiFiClient wifiClient;
PubSubClient mqttClient;

/**
 *  Handle WiFi Connectivity
 */
void setupWiFi()
{
  delay(WIFI_INITIAL_CONN_DELAY);

  // attempt to connect to a WiFi network
  Serial.println();
  Serial.print("[WiFi] Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(WIFI_CONN_RETRY_DELAY);
    Serial.print(".");
  }
  Serial.println();

  Serial.println("[WiFi] Connection established");
  Serial.print("[WiFi] IP address assigned by DHCP is ");
  Serial.println(WiFi.localIP());
}

/**
 *  Handle MQTT Server Connectivity
 */
void setup_mqtt_connection()
{
  // Loop until client is connected
  while (!mqttClient.connected())
  {
    Serial.print("[MQTT] Attempting MQTT connection...");
    Serial.println();
    // ToDo: Use ESP.getChipId()

    // Attempt to connect
    if (mqttClient.connect(MQTT_DEVICE_ID, CLIENT_AUTH_ID, CLIENT_AUTH_CREDENTIAL))
    {
      Serial.println("[MQTT] Connected to server");
      // Once connected, publish an announcement...
      mqttClient.publish(TOPIC_ECHO, "hello world");
    }
    else
    {
      Serial.print("Failed: rc=");
      Serial.print(mqttClient.state());
      Serial.println(" trying again in 5 seconds");

      // Wait before retrying
      delay(MQTT_CONN_RETRY_DELAY);
    }
  }
}

/**
 *  setup() function
 *
 *  will only run once, after each powerup or reset of the board.
 */
void setup()
{
  pinMode(BUILTIN_LED, OUTPUT); // Initialize the BUILTIN_LED pin as an output

  // initialize serial for debugging
  Serial.begin(SERIAL_DEBUG_PORT);

  // connect to WiFi
  setupWiFi();

  // configure client instance
  mqttClient.setClient(wifiClient);
  mqttClient.setServer(mqtt_server_ip, MQTT_SERVER_PORT);
  // client is now configured for use

  // Define output pins for MUX
  pinMode(MUX_A, OUTPUT);
  pinMode(MUX_B, OUTPUT);
  pinMode(MUX_C, OUTPUT);

  // ToDo: delay for 5min before initial sensor reading
}

/**
 *  Iterating Function
 */
void loop()
{
  if (!mqttClient.connected())
  {
    setup_mqtt_connection();
  }
  // should be called regularly to maintain its connection to the server
  mqttClient.loop();

  long now = millis();
  if (now - lastMsg > SENSOR_DATA_READING_DELAY)
  {
    lastMsg = now;

    // Turn the LED on by making the voltage LOW
    digitalWrite(BUILTIN_LED, LOW);

    Serial.println();
    Serial.print("Publish message: ");

    String airData = generateAirQualityDataBody();
    char *rawDataString = generateDataFormat(airData);
    unsigned int jsonStrLength = strlen(rawDataString);

    // publish data
    if (mqttClient.publish(TOPIC_LOCATION, rawDataString, jsonStrLength))
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
    int sensorValue = getSensorReading(channel);
    // ToDo: Get average for many values for precision

    // create an object
    JsonObject sensorObject = doc.createNestedObject();
    // set sensor fields to object
    sensorObject["id"] = channel;
    // sensorObject["type"] = "mq2"; // switch according to channel#
    sensorObject["value"] = sensorValue;

    // delay next channel read by 1sec
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