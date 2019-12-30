#include "Arduino.h"
#include "OpenAirSensors.h"

#define retries 5
#define retry_interval 20

MQSensor::MQSensor(char *id, char *name, char *category, int pin, int type) : AnalogSensor(id, name, category, pin)
{
  this->_type = type;

  if (_type == 2)
  {
    _ratioInCleanAir = RatioMQ2CleanAir;
    _R0 = R0_MQ2;
  }
  else if (_type == 7)
  {
    _ratioInCleanAir = RatioMQ7CleanAir;
    _R0 = R0_MQ7;
  }
  else if (_type == 135)
  {
    _ratioInCleanAir = RatioMQ135CleanAir;
    _R0 = R0_MQ135;
  }
}

double MQSensor::getR0()
{
  return _R0;
}

double MQSensor::getRL()
{
  return _RLValue;
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

  voltage = (avg / retries) * _VOLTAGE_RESOLUTION / (pow(2, ADC_RESOLUTION) - 1);

  return voltage;
}
