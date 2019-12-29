#include "Arduino.h"
#include "OpenAirSensors.h"

#define ANALOG_INPUT_PIN 0
#define MUX_SWITCH_DELAY 10000 // 10sec

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

//-------------------------------------------

// constructor extends constructor of base class
AnalogSensor::AnalogSensor(char *id, char *name, char *category, int pin) : Sensor(id, name, category, pin)
{
  this->_isAnalog = true;
}

float AnalogSensor::read()
{
  return analogRead(ANALOG_INPUT_PIN);
}

//-------------------------------------------

Mux::Mux(int selector_pin_0, int selector_pin_1, int selector_pin_2)
{
  this->_selector_pin_0 = selector_pin_0;
  this->_selector_pin_1 = selector_pin_1;
  this->_selector_pin_2 = selector_pin_2;
}

void Mux::setup()
{
  pinMode(this->_selector_pin_0, OUTPUT);
  pinMode(this->_selector_pin_1, OUTPUT);
  pinMode(this->_selector_pin_2, OUTPUT);
}

void Mux::switchChannel(int channel)
{
  digitalWrite(this->_selector_pin_0, bitRead(channel, 0));
  digitalWrite(this->_selector_pin_1, bitRead(channel, 1));
  digitalWrite(this->_selector_pin_2, bitRead(channel, 2));

  delay(MUX_SWITCH_DELAY);
}