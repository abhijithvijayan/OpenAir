#include "Arduino.h"
#include "OpenAirSensors.h"

#define ANALOG_INPUT 0
#define MUX_SWITCH_DELAY 10000 // 10sec

Sensor::Sensor(char *id, char *name, char *type, int pin)
{
  _id = id;
  _name = name;
  _type = type;
  _pin = pin;
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

int Sensor::getPin() const
{
  return _pin;
}

void Sensor::setup() {}

//-------------------------------------------

// constructor extends constructor of base class
AnalogSensor::AnalogSensor(char *id, char *name, char *type, int pin) : Sensor(id, name, type, pin)
{
  _isAnalog = true;
}

float AnalogSensor::read()
{
  return analogRead(ANALOG_INPUT);
}

//-------------------------------------------

Mux::Mux(int selector_pin_0, int selector_pin_1, int selector_pin_2)
{
  _selector_pin_0 = selector_pin_0;
  _selector_pin_1 = selector_pin_1;
  _selector_pin_2 = selector_pin_2;
}

void Mux::setup()
{
  pinMode(_selector_pin_0, OUTPUT);
  pinMode(_selector_pin_1, OUTPUT);
  pinMode(_selector_pin_2, OUTPUT);
}

void Mux::switchChannel(int channel)
{
  digitalWrite(_selector_pin_0, bitRead(channel, 0));
  digitalWrite(_selector_pin_1, bitRead(channel, 1));
  digitalWrite(_selector_pin_2, bitRead(channel, 2));

  delay(MUX_SWITCH_DELAY);
}