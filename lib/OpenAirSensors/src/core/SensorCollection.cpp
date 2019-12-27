#include "OpenAirSensors.h"

SensorCollection::SensorCollection(char *id, char *name, int ch_start, int ch_end)
{
  _id = id,
  _name = name;
  _size = 0;
  _ch_start = ch_start;
  _ch_end = ch_end;
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

int SensorCollection::getStartChannel() const
{
  return _ch_start;
}

int SensorCollection::getEndChannel() const
{
  return _ch_end;
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