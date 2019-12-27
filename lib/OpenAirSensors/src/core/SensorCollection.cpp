#include "OpenAirSensors.h"

SensorCollection::SensorCollection(char *id, char *name)
{
  _id = id,
  _name = name;
  _size = 0;
}

void SensorCollection::setup()
{
  for (int i = 0; i < _size; i++)
  {
    Sensor *sensor = _sensors[i];
    sensor->setup();
  }
}

char *SensorCollection::getId() const
{
  return _id;
}

char *SensorCollection::getName() const
{
  return _name;
}

int SensorCollection::getSize() const
{
  return _size;
}

void SensorCollection::addSensor(Sensor &sensor)
{
  _sensors[_size] = &sensor;
  _size++;
}

Sensor *SensorCollection::getSensor(int index)
{
  return _sensors[index];
}