class Sensor
{
public:
  Sensor(char *id, char *name, char *type);
  virtual void setup();
  virtual float read();

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
  virtual void setup();
  virtual float read();
};

class Mux
{
public:
  Mux(int selector_pin_1, int selector_pin_2, int selector_pin_3);

  virtual void setup();

private:
  int _selector_pin_1;
  int _selector_pin_2;
  int _selector_pin_3;
}