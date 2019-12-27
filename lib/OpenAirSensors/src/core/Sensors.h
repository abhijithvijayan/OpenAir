class Sensor
{
public:
  Sensor(char *id, char *name, char *type, int pin);
  virtual void setup();
  virtual float read();

  char *getId() const;
  char *getName() const;
  char *getType() const;
  int getPin() const;

protected:
  char *_id;
  char *_name;
  char *_type;
  int _pin;
};

class AnalogSensor : public Sensor
{
public:
  AnalogSensor(char *id, char *name, char *type, int pin);

  virtual float read();

protected:
  bool _isAnalog;
};

class Mux
{
public:
  Mux(int selector_pin_0, int selector_pin_1, int selector_pin_2);

  virtual void setup();
  virtual void switchChannel(int channel);

protected:
  int _selector_pin_0;
  int _selector_pin_1;
  int _selector_pin_2;
};