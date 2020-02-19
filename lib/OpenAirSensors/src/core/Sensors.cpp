#include "Arduino.h"
#include "OpenAirSensors.h"

#define ANALOG_INPUT_PIN 0

Sensor::Sensor(char *id, char *name, char *category, int pin)
{
  this->_id = id;
  this->_name = name;
  this->_category = category;
  this->_pin = pin;
}

char *Sensor::getId() const
{
  return _id;
}

char *Sensor::getName() const
{
  return _name;
}

char *Sensor::getCategory() const
{
  return _category;
}

int Sensor::getPin() const
{
  return _pin;
}

void Sensor::setup() {}

void Sensor::calibrate() {}

//-------------------------------------------

// constructor extends constructor of base class
AnalogSensor::AnalogSensor(char *id, char *name, char *category, int pin) : Sensor(id, name, category, pin)
{
  this->_isAnalog = true;
}

float AnalogSensor::read()
{
  // Serial.println("******Analog Read*******");
  return analogRead(ANALOG_INPUT_PIN);
}

//-------------------------------------------
