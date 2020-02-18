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
MQSensor MQ2("GS_jk3DS8h", "mq2", "gas", 0, 2);
MQSensor MQ7("GS_4fFjSc4", "mq7", "gas", 1, 7);
MQSensor MQ135("GS_kgDD75h", "mq135", "gas", 2, 135);

SensorCollection sensors("gas-sensors", "Example Sensor Collection");

void setup()
{
  // initialize serial for debugging
  Serial.begin(115200);

  // set up mux selector pins
  BREAKOUT_8_CHANNEL.setup();

  // add sensors to collection
  sensors.addSensor(MQ2);
  sensors.addSensor(MQ7);
  sensors.addSensor(MQ135);

  // ToDo: raise to 5min (preheat time)
  delay(5000);

  Serial.println("***************************");
  Serial.println("*******Setting Up**********");
  Serial.println("***************************");
  Serial.println();
  // set sensor voltage
  sensors.setup(BREAKOUT_8_CHANNEL);

  Serial.println("***************************");
  Serial.println("*******Calibrating*********");
  Serial.println("***************************");
  Serial.println();
  // Calibrate sensors
  sensors.calibrate(BREAKOUT_8_CHANNEL);
}

void loop()
{
  float smoke, CO, NOx;
  int sensorsCount = sensors.getSize();

  Serial.print("Total Number of Sensors ");
  Serial.println(sensorsCount);
  Serial.println();
  Serial.println("***************************");
  Serial.println("*******Reading Values******");
  Serial.println("***************************");
  Serial.println();

  for (int id = 0; id < sensorsCount; ++id)
  {
    Sensor *sensor = sensors.getSensor(id);

    // switch channel in mux
    BREAKOUT_8_CHANNEL.switchChannel(sensor->getPin());

    if (id == 0) {
      smoke = MQ2.getSensorReading();
    }
    else if (id == 1)
    {
      CO = MQ7.getSensorReading();
    }
    else if (id == 2)
    {
      NOx = MQ135.getSensorReading();
    }
  }
  Serial.println();
}
