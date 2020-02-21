#include "Arduino.h"
#include "OpenAirSensors.h"

// ToDo: Raise these to 10 & 1000
#define retries 5
#define retry_interval 20

/**
 *  Class Constructor
 */
MQSensor::MQSensor(char *id, char *name, char *category, int pin, int type)
    : AnalogSensor(id, name, category, pin) {
    this->_type = type;

    if (_type == 2) {
        _resistanceRatioInCleanAir = RatioMQ2CleanAir;
        _R0                        = R0_MQ2;
    } else if (_type == 7) {
        _resistanceRatioInCleanAir = RatioMQ7CleanAir;
        _R0                        = R0_MQ7;
    } else if (_type == 135) {
        _resistanceRatioInCleanAir = RatioMQ135CleanAir;
        _R0                        = R0_MQ135;
    }
}

/**
 *  Get Sensor Voltage
 *
 *  @returns voltage
 */
double MQSensor::getVoltage() {
    double avg = 0.0, voltage;

    for (int i = 0; i < retries; ++i) {
        avg += this->read();
        delay(retry_interval);
    }

    voltage =
        (avg / retries) * _VOLTAGE_RESOLUTION / (pow(2, ADC_RESOLUTION) - 1);

    return voltage;
}

/**
 *  Read & Update Sensor Voltage
 */
void MQSensor::setup() {
    this->_sensor_voltage = this->getVoltage();

    Serial.println("MQ: _sensor_voltage: " + String(this->_sensor_voltage));
    Serial.println();
}

/**
 *  Read RL Value
 *
 *  @returns _RLValue
 */
double MQSensor::getRL() { return _RLValue; }

/**
 *  Read stored resistance of the sensor
 *
 *  @returns R0
 */
double MQSensor::getR0() { return _R0; }

/**
 *  Update resistance of the sensor
 */
void MQSensor::setR0(double R0) { this->_R0 = R0; }

/**
 *  Calculate resistance of the sensor at a known concentration, R0
 *  https://jayconsystems.com/blog/understanding-a-gas-sensor
 *
 *  RS -> sensing resistance that changes depending on the concentration of gas
 *  R0 -> sensing resistance at a known concentration without the presence of
 * other gases
 *
 *  @returns R0
 */
float MQSensor::calcR0() {
    float RS_fresh_air, R0;

    // Calculate RS in fresh air
    RS_fresh_air =
        ((_VOLTAGE_RESOLUTION * _RLValue) / _sensor_voltage) - _RLValue;

    if (RS_fresh_air < 0) {
        RS_fresh_air = 0; // No negative values accepted.
    }

    // calculate R0
    R0 = RS_fresh_air / _resistanceRatioInCleanAir;

    if (R0 < 0) {
        R0 = 0; // No negative values accepted.
    }

    return R0;
}

/**
 *  Read `R0` and calibrate (update R0)
 */
void MQSensor::calibrate() {
    // calculate R0
    float R0 = this->calcR0();

    /**
     * Stick with default values for now
     * (due to large deviation from observed and actual)
     */
    if (this->_type == 2) {
        R0 = R0_MQ2;
    } else if (this->_type == 7) {
        R0 = R0_MQ7;
    } else if (this->_type == 135) {
        R0 = R0_MQ135;
    }

    // update R0
    this->setR0(R0);

    Serial.println("*******Calibrating*********");
    Serial.println("* Sensor: MQ-" + String(_type));
    Serial.println("* Vcc: " + String(_VOLTAGE_RESOLUTION));
    Serial.println("* _sensor_voltage: " + String(_sensor_voltage));
    Serial.println("* _RLValue: " + String(_RLValue));
    Serial.println("* _resistanceRatioInCleanAir: " +
                   String(_resistanceRatioInCleanAir));
    Serial.println("* R0: " + String(R0));
    Serial.println("***************************");
    Serial.println();
}

/**
 *  Update `_compound` with default compound of sensor
 */
void MQSensor::setDefaultGasForSensor() {
    if (this->_type == 2) {
        this->_compound = defaultMQ2;
    } else if (this->_type == 7) {
        this->_compound = defaultMQ7;
    } else if (this->_type == 135) {
        this->_compound = defaultMQ135;
    }
}

/**
 *  Set Upper & Lower compound values respective to sensor & compound
 */
void MQSensor::setGasCompoundPairValue(String compound) {
    // if compound not passed
    if (compound == "") {
        // set default compound
        setDefaultGasForSensor();
        // update `compound` variable for updating `_a` & `_b`
        compound = this->_compound;
    }

    // MQ2
    if (this->_type == 2) {
        if (compound == "smoke") {
            this->_compound = "smoke";
            this->_a        = MQ2_smoke_a;
            this->_b        = MQ2_smoke_b;
        } else if (compound == "H2") {
            this->_compound = "H2";
            this->_a        = MQ2_H2_a;
            this->_b        = MQ2_H2_b;
        } else if (compound == "LPG") {
            this->_compound = "LPG";
            this->_a        = MQ2_LPG_a;
            this->_b        = MQ2_LPG_b;
        } else if (compound == "Propane") {
            this->_compound = "Propane";
            this->_a        = MQ2_Propane_a;
            this->_b        = MQ2_Propane_b;
        } else if (compound == "CO") {
            this->_compound = "CO";
            this->_a        = MQ2_CO_a;
            this->_b        = MQ2_CO_b;
        } else if (compound == "Alcohol") {
            this->_compound = "Alcohol";
            this->_a        = MQ2_Alcohol_a;
            this->_b        = MQ2_Alcohol_b;
        }
    }

    // MQ7
    else if (this->_type == 7) {
        if (compound == "CO") {
            this->_compound = "CO";
            this->_a        = MQ7_CO_a;
            this->_b        = MQ7_CO_b;
        } else if (compound == "H2") {
            this->_compound = "H2";
            this->_a        = MQ7_H2_a;
            this->_b        = MQ7_H2_b;
        } else if (compound == "Alcohol") {
            this->_compound = "Alcohol";
            this->_a        = MQ7_Alcohol_a;
            this->_b        = MQ7_Alcohol_b;
        } else if (compound == "LPG") {
            this->_compound = "LPG";
            this->_a        = MQ7_LPG_a;
            this->_b        = MQ7_LPG_b;
        } else if (compound == "CH4") {
            this->_compound = "CH4";
            this->_a        = MQ7_CH4_a;
            this->_b        = MQ7_CH4_b;
        }
    }

    // MQ135
    else if (this->_type == 135) {
        if (compound == "NOx") {
            this->_compound = "NOx";
            this->_a        = MQ135_NOx_a;
            this->_b        = MQ135_NOx_b;
        } else if (compound == "NH4") {
            this->_compound = "NH4";
            this->_a        = MQ135_NH4_a;
            this->_b        = MQ135_NH4_b;
        } else if (compound == "CO2") {
            this->_compound = "CO2";
            this->_a        = MQ135_CO2_a;
            this->_b        = MQ135_CO2_b;
        } else if (compound == "Acetona") {
            this->_compound = "Acetona";
            this->_a        = MQ135_Acetona_a;
            this->_b        = MQ135_Acetona_b;
        } else if (compound == "Alcohol") {
            this->_compound = "Alcohol";
            this->_a        = MQ135_Alcohol_a;
            this->_b        = MQ135_Alcohol_b;
        } else if (compound == "Tolueno") {
            this->_compound = "Tolueno";
            this->_a        = MQ135_Tolueno_a;
            this->_b        = MQ135_Tolueno_b;
        } else if (compound == "CO") {
            this->_compound = "CO";
            this->_a        = MQ135_CO_a;
            this->_b        = MQ135_CO_b;
        }
    }
}

/**
 *  Read PPM Value of Compound from Sensor
 *
 *  @returns _PPM
 */
float MQSensor::getSensorReading(String compound) {
    /**
     * https://jayconsystems.com/blog/understanding-a-gas-sensor
     */

    // update _a and _b respective to compound
    setGasCompoundPairValue(compound);

    // read & update sensor voltage
    this->setup();

    // Get value of RS in a gas
    this->_RS_gas =
        ((_VOLTAGE_RESOLUTION * _RLValue) / _sensor_voltage) - _RLValue;

    if (_RS_gas < 0) {
        this->_RS_gas = 0; // No negative values accepted.
    }

    // calculate ratio
    this->_ratio = _RS_gas / this->_R0;

    if (_ratio <= 0 || _ratio > 100) {
        this->_ratio = 0.01; // No negative values accepted or upper datasheet
                             // recomendation.
    }

    // calculate ppm value
    this->_PPM = _a * pow(_ratio, _b);

    if (_PPM < 0) {
        this->_PPM = 0; // No negative values accepted
    }

    if (_PPM > 10000) {
        this->_PPM = 9999; // Upper datasheet recomendation.
    }

    // Display neat formatted data
    Serial.println("***************************");
    Serial.println("* Sensor: MQ-" + String(_type));
    Serial.println("* Vcc: " + String(_VOLTAGE_RESOLUTION) +
                   ", RS: " + String(_RS_gas));
    Serial.println("* RS/R0 = " + String(_ratio) +
                   ", Voltage Read(ADC): " + String(_sensor_voltage));
    Serial.println("* PPM = " + String(_a) + "*pow(" + String(_ratio) + "," +
                   String(_b) + ")");
    Serial.println("* Compound(" + _compound + ") = " + String(_PPM) + " PPM");
    Serial.println("***************************");

    return _PPM;
}