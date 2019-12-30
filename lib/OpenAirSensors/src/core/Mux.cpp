#include "Arduino.h"
#include "OpenAirSensors.h"

#define MUX_SWITCH_DELAY 10000 // 10sec

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