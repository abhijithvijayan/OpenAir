const int MAX_SENSORS = 8;

class SensorCollection
{
public:
  SensorCollection(char *id, char *name, int ch_start, int ch_end);
  void setup();

  char *getId() const;
  char *getName() const;
  int getSize() const;
  int getStartChannel() const;
  int getEndChannel() const;
  void addSensor(Sensor &sensor);

  Sensor *getSensor(int index);
  Sensor *getSensor(char *id);

private:
  Sensor *_sensors[MAX_SENSORS];
  int _size;
  char *_id;
  char *_name;
  int _ch_start;
  int _ch_end;
};