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
#include <PubSubClient.h>

#define MQTT_DEVICE_ID "........";
#define CLIENT_AUTH_ID "........";
#define CLIENT_AUTH_CREDENTIAL "........";

// Update these with values suitable for your network.
const char *ssid = "........";
const char *password = "........";
IPAddress mqtt_server(0, 0, 0, 0);

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

long lastMsg = 0;
char msg[50];
int value = 0;

// Creates an uninitialised client instance.
WiFiClient wifiClient;
PubSubClient client;

/**
 *  Handle WiFi Connectivity
 */
void setup_wifi()
{
  delay(10);

  // attempt to connect to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

/**
 *  Print any message received for subscribed topic
 */
void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  for (int i = 0; i < length; i++)
  {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // Switch on the LED if an 1 was received as first character
  if ((char)payload[0] == '1')
  {
    digitalWrite(BUILTIN_LED, LOW); // Turn the LED on (Note that LOW is the voltage level
    // but actually the LED is on; this is because it is acive low on the ESP-01)
  }
  else
  {
    digitalWrite(BUILTIN_LED, HIGH); // Turn the LED off by making the voltage HIGH
  }
}

/**
 *  MQTT Reconnector
 */
void reconnect()
{
  // Loop until we're reconnected
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");

    // Create a random client ID
    String clientId = "OpenAirClient-";
    clientId += String(random(0xffff), HEX);

    // Attempt to connect
    if (client.connect(MQTT_DEVICE_ID, CLIENT_AUTH_ID, CLIENT_AUTH_CREDENTIAL))
    {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("sensors", "hello world");
      // ... and resubscribe
      client.subscribe("testing");
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");

      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

/**
 *  Driver Function
 */
void setup()
{
  pinMode(BUILTIN_LED, OUTPUT); // Initialize the BUILTIN_LED pin as an output

  // initialize serial for debugging
  Serial.begin(115200);

  // connect to WiFi
  setup_wifi();

  // configure client instance
  client.setClient(wifiClient);
  client.setServer(mqtt_server, 1883);
  // client is now configured for use
  client.setCallback(callback);

  // Define output pins for Mux
  pinMode(MUX_A, OUTPUT);
  pinMode(MUX_B, OUTPUT);
  pinMode(MUX_C, OUTPUT);
}

/**
 *  Get sensor reading
 */
int readSig(int channel)
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
  int sigValue = analogRead(ANALOG_INPUT);

  // return the received analog value
  return sigValue;
}

/**
 *  Iterating Function
 */
void loop()
{

  if (!client.connected())
  {
    reconnect();
  }
  client.loop();

  long now = millis();
  if (now - lastMsg > 5000)
  {
    lastMsg = now;

    for (int channel = 0; channel < 3; ++channel)
    {
      // read sensor output value
      int sigValue = readSig(channel);

      // print the analog / digital value to the serial monitor
      Serial.print("Value at channel ");
      Serial.print(channel);
      Serial.print(" is : ");
      Serial.println(sigValue);

      // delay next read by 1sec
      delay(1000);
    }
    Serial.println();

    ++value;
    snprintf(msg, 75, "hello world #%ld", value);
    Serial.print("Publish message: ");
    Serial.println(msg);
    client.publish("sensors", msg);
  }
}
