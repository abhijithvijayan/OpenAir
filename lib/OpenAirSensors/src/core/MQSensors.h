class MQSensor : public AnalogSensor
{
public:
  MQSensor(char *id, char *name, char *category, int pin, int type);

protected:
  int _type;
};