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

  // set sensor voltage
  sensors.setup(BREAKOUT_8_CHANNEL);

  // Calibrate sensors
  sensors.calibrate(BREAKOUT_8_CHANNEL);
}

void loop()
{
  float H2, LPG, CH4, CO, Alcohol;
  int sensorsCount = sensors.getSize();

  Serial.print("Total Number of Sensors ");
  Serial.println(sensorsCount);
  Serial.println();
  Serial.println("Reading Values");

  for (int id = 0; id < sensorsCount; ++id)
  {
    Sensor *sensor = sensors.getSensor(id);
    // switch channel in mux
    BREAKOUT_8_CHANNEL.switchChannel(sensor->getPin());

    if (id == 1) {
      H2 = MQ7.getSensorReading("H2");           // Return CH4 concentration
      LPG = MQ7.getSensorReading("LPG");         // Return LPG concentration
      CH4 = MQ7.getSensorReading("CH4");         // Return CH4 concentration
      CO = MQ7.getSensorReading("CO");           // Return CO concentration
      Alcohol = MQ7.getSensorReading("Alcohol"); // Return Alcohol concentration

      Serial.println("***************************");
      Serial.println("Concentrations for MQ-7");
      Serial.print("R0: ");
      Serial.print(MQ7.getR0());
      Serial.println(" Ohm");
      Serial.print("H2: ");
      Serial.print(H2, 2);
      Serial.println(" ppm");
      Serial.print("LPG: ");
      Serial.print(LPG, 2);
      Serial.println(" ppm");
      Serial.print("CH4: ");
      Serial.print(CH4, 2);
      Serial.println(" ppm");
      Serial.print("CO: ");
      Serial.print(CO, 2);
      Serial.println(" ppm");
      Serial.print("Alcohol: ");
      Serial.print(Alcohol, 2);
      Serial.println(" ppm");
      Serial.println("***************************");
    }
      // read raw analog value
      // int reading = sensor->read();

      Serial.print("Sensor ");
      Serial.println(sensor->getName());
      // Serial.print("Reading ");
      // Serial.println(reading);
  }
  Serial.println();
}
