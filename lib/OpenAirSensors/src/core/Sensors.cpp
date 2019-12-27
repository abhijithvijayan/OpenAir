#include "Arduino.h"
#include "OpenAirSensors.h"

// constructor
Sensor::Sensor(char *id, char *name, char *type)
{
  _id = id;
  _name = name;
  _type = type;
}

char *Sensor::getId() const
{
  return _id;
}

char *Sensor::getName() const
{
  return _name;
}

char *Sensor::getType() const
{
  return _type;
}

void Sensor::setup() {}

//-------------------------------------------

AnalogSensor::AnalogSensor(int pin, char *id, char *name, char *type) : Sensor(id, name, type)
{
  _pin = pin;
}

int AnalogSensor::getPin() const
{
  return _pin;
}

void AnalogSensor::setup()
{
  Serial.println('Setting up sensor');
  pinMode(_pin, OUTPUT);
}

float AnalogSensor::read()
{
  return analogRead(_pin);
}
