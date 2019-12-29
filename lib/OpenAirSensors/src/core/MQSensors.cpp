#include "Arduino.h"
#include "OpenAirSensors.h"

#define retries 5
#define retry_interval 20

MQSensor::MQSensor(char *id, char *name, char *category, int pin, int type) : AnalogSensor(id, name, category, pin)
{
  this->_type = type;
}

void MQSensor::setup()
{
  this->_sensor_voltage = this->getVoltage();
}

double MQSensor::getVoltage()
{
  double avg = 0.0, voltage;

  for (int i = 0; i < retries; ++i)
  {
    avg += this->read();
    delay(retry_interval);
  }

  voltage = (avg / retries) * _VOLT_RESOLUTION / (pow(2, ADC_RESOLUTION) - 1);

  return voltage;
}