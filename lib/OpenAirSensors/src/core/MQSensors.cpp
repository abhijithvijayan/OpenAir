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

void MQSensor::setR0(double R0)
{
  this->_R0 = R0;
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

float MQSensor::calibrate()
{
  /**
   * https://jayconsystems.com/blog/understanding-a-gas-sensor
   *
   * I = V / R
   * I = VC / (RS+RL)
   * V = I x R
   * VRL = [VC / (RS + RL)] x RL
   * VRL = (VC x RL) / (RS + RL)
   * VRL x (RS + RL) = VC x RL
   * (VRL x RS) + (VRL x RL) = VC x RL
   * (VRL x RS) = (VC x RL) - (VRL x RL)
   *
   * RS -> resistance of the sensor that changes depending on the concentration of gas
   * R0 -> resistance of the sensor at a known concentration without the presence of other gases
   *
   * RS = [(VC x RL) - (VRL x RL)] / VRL
   * RS = [(VC x RL) / VRL] - RL
   */

  float RS_air, R0;

  // Calculate RS in fresh air
  RS_air = ((_VOLTAGE_RESOLUTION * _RLValue) / _sensor_voltage) - _RLValue;

  if (RS_air < 0)
  {
    RS_air = 0; // No negative values accepted.
  }

  R0 = RS_air / _ratioInCleanAir;

  if (R0 < 0)
  {
    R0 = 0; // No negative values accepted.
  }

  Serial.println("*******Calibrating*********");
  Serial.println("* Sensor: MQ-" + String(_type));
  Serial.println("* Vcc: " + String(_VOLTAGE_RESOLUTION));
  Serial.println("* _sensor_voltage: " + String(_sensor_voltage));
  Serial.println("* _RLValue: " + String(_RLValue));
  Serial.println("* _ratioInCleanAir: " + String(_ratioInCleanAir));
  Serial.println("* R0: " + String(R0));
  Serial.println("*******Calibrating*********");

  return R0;
}

void MQSensor::setGasCompoundPairValue(String compound)
{
  // MQ2
  if (this->_type == 2)
  {
    if (compound == "H2")
    {
      this->_compound = "H2";
      this->_a = MQ2_H2_a;
      this->_b = MQ2_H2_b;
    }
    else if (compound == "LPG")
    {
      this->_compound = "LPG";
      this->_a = MQ2_LPG_a;
      this->_b = MQ2_LPG_b;
    }
    else if (compound == "CO")
    {
      this->_compound = "CO";
      this->_a = MQ2_CO_a;
      this->_b = MQ2_CO_b;
    }
    else if (compound == "Alcohol")
    {
      this->_compound = "Alcohol";
      this->_a = MQ2_Alcohol_a;
      this->_b = MQ2_Alcohol_b;
    }
    else if (compound == "Propane")
    {
      this->_compound = "Propane";
      this->_a = MQ2_Propane_a;
      this->_b = MQ2_Propane_b;
    }
  }
  // MQ7
  else if (this->_type == 7)
  {
    if (compound == "H2")
    {
      this->_compound = "H2";
      this->_a = MQ7_H2_a;
      this->_b = MQ7_H2_b;
    }
    else if (compound == "LPG")
    {
      this->_compound = "LPG";
      this->_a = MQ7_LPG_a;
      this->_b = MQ7_LPG_b;
    }
    else if (compound == "CH4")
    {
      this->_compound = "CH4";
      this->_a = MQ7_CH4_a;
      this->_b = MQ7_CH4_b;
    }
    else if (compound == "CO")
    {
      this->_compound = "CO";
      this->_a = MQ7_CO_a;
      this->_b = MQ7_CO_b;
    }
    else if (compound == "Alcohol")
    {
      this->_compound = "Alcohol";
      this->_a = MQ7_Alcohol_a;
      this->_b = MQ7_Alcohol_b;
    }
  }
  // MQ135
  else if (this->_type == 135)
  {
    if (compound == "CO")
    {
      this->_compound = "CO";
      this->_a = MQ135_CO_a;
      this->_b = MQ135_CO_b;
    }
    else if (compound == "Alcohol")
    {
      this->_compound = "Alcohol";
      this->_a = MQ135_Alcohol_a;
      this->_b = MQ135_Alcohol_b;
    }
    else if (compound == "CO2")
    {
      this->_compound = "CO2";
      this->_a = MQ135_CO2_a;
      this->_b = MQ135_CO2_b;
    }
    else if (compound == "Tolueno")
    {
      this->_compound = "Tolueno";
      this->_a = MQ135_Tolueno_a;
      this->_b = MQ135_Tolueno_b;
    }
    else if (compound == "NH4")
    {
      this->_compound = "NH4";
      this->_a = MQ135_NH4_a;
      this->_b = MQ135_NH4_b;
    }
    else if (compound == "Acetona")
    {
      this->_compound = "Acetona";
      this->_a = MQ135_Acetona_a;
      this->_b = MQ135_Acetona_b;
    }
  }
}

float MQSensor::getSensorReading(String compound)
{
  /**
   * https://jayconsystems.com/blog/understanding-a-gas-sensor
   */

  // updates _a and _b
  setGasCompoundPairValue(compound);

  // Get value of RS in a gas
  this->_RS_Calc = ((_VOLTAGE_RESOLUTION * _RLValue) / _sensor_voltage) - _RLValue;

  if (_RS_Calc < 0)
  {
    this->_RS_Calc = 0; // No negative values accepted.
  }

  //  Get ratio: RS_gas/RS_air
  this->_ratio = _RS_Calc / this->_R0;

  if (_ratio <= 0 || _ratio > 100)
  {
    this->_ratio = 0.01; // No negative values accepted or upper datasheet recomendation.
  }

  this->_PPM = _a * pow(_ratio, _b);

  if (_PPM < 0)
  {
    this->_PPM = 0; // No negative values accepted
  }

  if (_PPM > 10000)
  {
    this->_PPM = 9999; // Upper datasheet recomendation.
  }

  Serial.println("***************************");
  Serial.println("* Sensor: MQ-" + String(_type));
  Serial.println("* Vcc: " + String(_VOLTAGE_RESOLUTION) + ", RS: " + String(_RS_Calc));
  Serial.println("* RS/R0 = " + String(_ratio) + ", Voltage Read(ADC): " + String(_sensor_voltage));
  Serial.println("* PPM = " + String(_a) + "*pow(" + String(_ratio) + "," + String(_b) + ")");
  Serial.println("* Compound(" + compound + ") = " + String(_PPM) + " PPM");
  Serial.println("***************************");

  return _PPM;
}