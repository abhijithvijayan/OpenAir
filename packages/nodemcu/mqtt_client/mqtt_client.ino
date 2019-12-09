#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#define MUX_A D0
#define MUX_B D1
#define MUX_C D2

#define ANALOG_INPUT A0
#define sig 0

// Mux channel select pins
#define setPin0 16 //GPIO 16 (D0 on NodeMCU)
#define setPin1 5  //GPIO 5 (D1 on NodeMCU)
#define setPin2 4  //GPIO 4 (D2 on NodeMCU)

// Update these with values suitable for your network.
const char *ssid = "F.R.I.E.N.D.S";
const char *password = "F.R.I.E.N.D.S";
// local IP of RPi
IPAddress mqtt_server(192, 168, 1, 172);

// Initialize the client object
WiFiClient espClient;
PubSubClient client(espClient);

long lastMsg = 0;
char msg[50];
int value = 0;

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
    // but actually the LED is on; this is because
    // it is acive low on the ESP-01)
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
    if (client.connect(clientId.c_str()))
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

  //connect to MQTT server
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  //Define output pins for Mux
  pinMode(MUX_A, OUTPUT);
  pinMode(MUX_B, OUTPUT);
  pinMode(MUX_C, OUTPUT);
}

int readSig(int channel)
{
  // use the first three bits of the channel number to set the channel select pins
  digitalWrite(setPin0, bitRead(channel, 0));
  digitalWrite(setPin1, bitRead(channel, 1));
  digitalWrite(setPin2, bitRead(channel, 2));

  // read from the selected mux channel
  int sigValue = analogRead(sig);

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

    for (int i = 0; i < 3; i++)
    {
      int sigValue = readSig(i);

      // print the analog / digital value to the serial monitor

      Serial.print("Value at channel ");
      Serial.print(i);
      Serial.print(" is : ");
      Serial.println(readSig(i));
    }
    Serial.println();

    ++value;
    snprintf(msg, 75, "hello world #%ld", value);
    Serial.print("Publish message: ");
    Serial.println(msg);
    // client.publish("sensors", msg);
  }
}
