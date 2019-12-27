const int MAX_SENSORS = 8;

class SensorCollection
{
public:
  SensorCollection(char *id, char *name);
  void setup();

  char *getId() const;
  char *getName() const;
  int getSize() const;
  void addSensor(Sensor &sensor);

  Sensor *getSensor(int index);

private:
  Sensor *_sensors[MAX_SENSORS];
  int _size;
  char *_id;
  char *_name;
};