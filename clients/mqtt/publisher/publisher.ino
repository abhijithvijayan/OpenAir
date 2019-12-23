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
char msg[50];
int iteration = 0;

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
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(WIFI_CONN_RETRY_DELAY);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
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
    Serial.print("Attempting MQTT connection...");

    // Attempt to connect
    if (mqttClient.connect(MQTT_DEVICE_ID, CLIENT_AUTH_ID, CLIENT_AUTH_CREDENTIAL))
    {
      Serial.println("Success: Connected to server");
      // Once connected, publish an announcement...
      mqttClient.publish("echo", "hello world");
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

  // compute the required size for json data
  const size_t CAPACITY = JSON_OBJECT_SIZE(4) + JSON_OBJECT_SIZE(2) + JSON_ARRAY_SIZE(3) + 3 * JSON_OBJECT_SIZE(3);
  StaticJsonDocument<CAPACITY> encodedJsonData;

  // push static location info
  encodedJsonData["name"] = LOCATION_NAME;
  encodedJsonData["type"] = LOCATION_TYPE;

  // creates an object with key `coordinates`
  JsonObject coordinates = encodedJsonData.createNestedObject("coordinates");
  coordinates["lat"] = LATITUDE;
  coordinates["lng"] = LONGITUDE;
  // create empty nested array
  JsonArray air_data = encodedJsonData.createNestedArray("air");

  long now = millis();
  if (now - lastMsg > SENSOR_DATA_READING_DELAY)
  {
    lastMsg = now;
    digitalWrite(BUILTIN_LED, LOW); // Turn the LED on (Note that LOW is the voltage level
    // but actually the LED is on; this is because it is active low on the ESP-01)

    // Iterate through all used channels
    for (int channel = 0; channel < 3; ++channel)
    {
      // Get sensor reading
      int sensorValue = getSensorReading(channel);

      // write back the analog / digital value to the serial monitor
      Serial.print("Value at channel ");
      Serial.print(channel);
      Serial.print(" is : ");
      Serial.println(sensorValue);

      // create an object
      JsonObject sensor_data = air_data.createNestedObject();
      // set sensor fields to object
      sensor_data["id"] = channel;
      // sensor_data["type"] = "mq2"; // switch according to channel#
      sensor_data["value"] = sensorValue;

      // delay next channel read by 1sec
      delay(SENSOR_SWITCH_DELAY);
    }
    Serial.println();

    ++iteration;
    // Write formatted output to sized buffer
    snprintf(msg, 75, "Publish #%ld", iteration);
    Serial.print("Publish message: ");

    // write back json to serial
    serializeJson(encodedJsonData, Serial);
    // Cast Json to a String
    // String output = encodedJsonData.as<String>();
    // publish data
    // mqttClient.publish("location", output);

    digitalWrite(BUILTIN_LED, HIGH); // Turn the LED off by making the voltage HIGH
  }
}
