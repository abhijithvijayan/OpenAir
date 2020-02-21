#include <ESP8266WiFi.h>
#include <OpenAirSensors.h>

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

// initialize mux
Mux Breakout_8_Channel_Mux(SELECTOR_PIN_0, SELECTOR_PIN_1, SELECTOR_PIN_2);

// id, name, category, pin(channel number: y0, y1, y2, ...), type
MQSensor MQ2("GS_jk3DS8h", "mq2", "gas", 0, 2);
MQSensor MQ7("GS_4fFjSc4", "mq7", "gas", 1, 7);
MQSensor MQ135("GS_kgDD75h", "mq135", "gas", 2, 135);

// create a sensor collection
SensorCollection sensors("gas-sensors", "Example Sensor Collection");

void setup() {
    // initialize serial for debugging
    Serial.begin(115200);

    // set up mux output pins
    Breakout_8_Channel_Mux.setup();

    // add sensors to collection
    sensors.addSensor(MQ2);
    sensors.addSensor(MQ7);
    sensors.addSensor(MQ135);

    // ToDo: raise to 5min(300000) // preheat time
    delay(5000);

    Serial.println("***************************");
    Serial.println("*******Setting Up**********");
    Serial.println("***************************");
    Serial.println();

    // set sensor voltage
    sensors.setup(Breakout_8_Channel_Mux);

    Serial.println("***************************");
    Serial.println("*******Calibrating*********");
    Serial.println("***************************");
    Serial.println();

    // Calibrate sensors
    sensors.calibrate(Breakout_8_Channel_Mux);
}

void loop() {
    float smoke, CO, NOx;
    int sensorsCount = sensors.getSize();

    Serial.print("Total Number of Sensors ");
    Serial.println(sensorsCount);
    Serial.println();
    Serial.println("***************************");
    Serial.println("*******Reading Values******");
    Serial.println("***************************");
    Serial.println();

    for (int id = 0; id < sensorsCount; ++id) {
        Sensor *sensor   = sensors.getSensor(id);
        char *sensorName = sensor->getName();

        // switch channel in mux
        Breakout_8_Channel_Mux.switchChannel(sensor->getPin());

        if (sensorName == "mq2") {
            smoke = MQ2.getSensorReading();
        } else if (sensorName == "mq7") {
            CO = MQ7.getSensorReading();
        } else if (sensorName == "mq135") {
            NOx = MQ135.getSensorReading();
        }
    }
    Serial.println();
}
