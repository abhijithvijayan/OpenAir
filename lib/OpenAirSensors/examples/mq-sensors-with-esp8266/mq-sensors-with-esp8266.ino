#include <OpenAirSensors.h>
#include <ESP8266WiFi.h>

/**
 * 
 *  D0   = 16;
 *  D1   = 5;
 *  D2   = 4;
 *  D3   = 0;
 *  D4   = 2;
 *  D5   = 14;
 *  D6   = 12;
 *  D7   = 13;
 *  D8   = 15;
 *  D9   = 3;
 *  D10  = 1;
 */

AnalogSensor sensor1(5, "GS_jk3DS8h", "mq2", "gas");
AnalogSensor sensor2(4, "GS_4fFjSc4", "mq7", "gas");
AnalogSensor sensor3(0, "GS_kgDD75h", "mq135", "gas");

SensorCollection sensors("gas-sensors", "Example Sensor Collection");

void setup()
{
  sensors.addSensor(sensor1);
  sensors.addSensor(sensor2);
  sensors.addSensor(sensor3);
  sensors.setup();
}

void loop()
{
  delay(1000);
}
