#define ADC_RESOLUTION 10 // for 10bit analog to digital converter (eg: NodeMCU).

class MQSensor : public AnalogSensor
{
public:
  MQSensor(char *id, char *name, char *category, int pin, int type);

  double getVoltage();
  void setup();

protected:
  int _type;
  float _sensor_voltage;
  float _VOLT_RESOLUTION = 5.0; // if 3.3v use 3.3
};