class Sensor
{
public:
  Sensor(char *id, char *name, char *type);
  virtual void setup();

  char *getId() const;
  char *getName() const;
  char *getType() const;

protected:
  char *_id;
  char *_name;
  char *_type;
};

class AnalogSensor : public Sensor
{
public:
  AnalogSensor(int pin, char *id, char *name, char *type);

  int getPin() const;

  virtual void setup();
  virtual float read();

private:
  int _pin;
};