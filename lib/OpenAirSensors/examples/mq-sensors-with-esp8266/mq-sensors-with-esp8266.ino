#include <OpenAirSensors.h>
#include <ESP8266WiFi.h>

/**
 *  D0   = 16;
 *  D1   =  5;
 *  D2   =  4;
 *  D3   =  0;
 *  D4   =  2;
 *  D5   = 14;
 *  D6   = 12;
 *  D7   = 13;
 *  D8   = 15;
 *  D9   =  3;
 *  D10  =  1;
 */

#define SELECTOR_PIN_0 5 // GPIO 5 (D1 on NodeMCU)
#define SELECTOR_PIN_1 4 // GPIO 4 (D2 on NodeMCU)
#define SELECTOR_PIN_2 0 // GPIO 0 (D3 on NodeMCU)

Mux BREAKOUT_8_CHANNEL(SELECTOR_PIN_0, SELECTOR_PIN_1, SELECTOR_PIN_2);

// channel number: y0, y1, y2
AnalogSensor sensor1("GS_jk3DS8h", "mq2", "gas", 0);
AnalogSensor sensor2("GS_4fFjSc4", "mq7", "gas", 1);
AnalogSensor sensor3("GS_kgDD75h", "mq135", "gas", 2);

SensorCollection sensors("gas-sensors", "Example Sensor Collection");

void setup()
{
  // initialize serial for debugging
  Serial.begin(115200);
  sensors.addSensor(sensor1);
  sensors.addSensor(sensor2);
  sensors.addSensor(sensor3);

  BREAKOUT_8_CHANNEL.setup();

  delay(5000);
}

void loop()
{
  Serial.print("Total Number of Sensors ");
  int sensorsCount = sensors.getSize();
  Serial.println(sensorsCount);

  Serial.println();
  Serial.println("Reading Values");
  for (int index = 0; index < sensorsCount; ++index)
  {
    Sensor *sensor = sensors.getSensor(index);
    // switch channel
    BREAKOUT_8_CHANNEL.switchChannel(sensor->getPin());
    // read raw analog value
    int reading = sensor->read();

    Serial.print("Sensor ");
    Serial.println(sensor->getName());
    Serial.print("Reading ");
    Serial.println(reading);
  }
  Serial.println();
}
