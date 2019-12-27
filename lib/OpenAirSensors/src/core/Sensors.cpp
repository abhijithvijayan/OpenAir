#include "Arduino.h"
#include "OpenAirSensors.h"

#define ANALOG_INPUT 0

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

int AnalogSensor::getPin() const
{
  return _pin;
}

float AnalogSensor::read()
{
  return analogRead(ANALOG_INPUT);
}

//-------------------------------------------

Mux::Mux(int selector_pin_1, int selector_pin_2, int selector_pin_3)
{
  _selector_pin_1 = selector_pin_1;
  _selector_pin_2 = selector_pin_2;
  _selector_pin_3 = selector_pin_3;
}

void Mux::setup()
{
  pinMode(_selector_pin_1, OUTPUT);
  pinMode(_selector_pin_2, OUTPUT);
  pinMode(_selector_pin_3, OUTPUT);
}