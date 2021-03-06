#include "OpenAirSensors.h"

SensorCollection::SensorCollection(char *id, char *name) {
    this->_id = id, this->_name = name;
    this->_size = 0;
}

void SensorCollection::setup(Mux &breakout) {
    for (int i = 0; i < _size; i++) {
        Sensor *sensor = this->_sensors[i];
        breakout.switchChannel(sensor->getPin());
        sensor->setup();
    }
}

void SensorCollection::calibrate(Mux &breakout) {
    for (int i = 0; i < _size; i++) {
        Sensor *sensor = this->_sensors[i];
        breakout.switchChannel(sensor->getPin());
        sensor->calibrate();
    }
}

char *SensorCollection::getId() const { return _id; }

char *SensorCollection::getName() const { return _name; }

int SensorCollection::getSize() const { return _size; }

void SensorCollection::addSensor(Sensor &sensor) {
    this->_sensors[_size] = &sensor;
    this->_size++;
}

Sensor *SensorCollection::getSensor(int index) { return _sensors[index]; }

Sensor *SensorCollection::getSensor(char *id) {
    for (int i = 0; i < this->_size; ++i) {
        Sensor *sensor = this->_sensors[i];

        if (strcmp(id, sensor->getId()) == 0) {
            return sensor;
        }
    }

    return NULL;
}