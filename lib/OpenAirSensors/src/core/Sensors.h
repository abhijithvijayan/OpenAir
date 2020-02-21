class Sensor {
  public:
    Sensor(char *id, char *name, char *category, int pin);
    virtual void setup();
    virtual void calibrate();
    virtual float read();

    char *getId() const;
    char *getName() const;
    char *getCategory() const;
    int getPin() const;

  protected:
    char *_id;
    char *_name;
    char *_category;
    int _pin;
};

class AnalogSensor : public Sensor {
  public:
    AnalogSensor(char *id, char *name, char *category, int pin);

    virtual float read();

  protected:
    bool _isAnalog;
};
