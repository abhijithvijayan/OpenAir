/* ******************************************************************************* */

#define ADC_RESOLUTION 10 // for 10bit analog to digital converter (eg: NodeMCU).

/* ******************************************************************************* */
/**
 *  Gas, Value of a and b points
 *  Values consolidated
 *  Equation: PPM = a*((x)^b)
 */
/* ********************* MQ2 ***************************************************** */
// Datasheet: https://robokits.download/downloads/MQ-2.pdf

#define defaultMQ2 "LPG"
#define RatioMQ2CleanAir 9.83 // RS / R0 = 9.83 ppm
#define R0_MQ2 9.659574468    // R0 after 48 hours pre-heating the sensor

#define MQ2_H2_a 987.99
#define MQ2_H2_b -2.162

#define MQ2_LPG_a 574.25
#define MQ2_LPG_b -2.222

#define MQ2_CO_a 36974
#define MQ2_CO_b -3.109

#define MQ2_Alcohol_a 3616.1
#define MQ2_Alcohol_b -2.675

#define MQ2_Propane_a 658.71
#define MQ2_Propane_b -2.168

/* ********************* MQ7 ***************************************************** */
// Datasheet: https://robokits.download/downloads/MQ-7.pdf

#define defaultMQ7 "CO"
#define RatioMQ7CleanAir 27.5 // RS / R0 = 27.5 ppm
#define R0_MQ7 4              // R0 after 48 hours pre-heating the sensor

#define MQ7_H2_a 69.014
#define MQ7_H2_b -1.374

#define MQ7_LPG_a 700000000
#define MQ7_LPG_b -7.703

#define MQ7_CH4_a 60000000000000
#define MQ7_CH4_b -10.54

#define MQ7_CO_a 99.042
#define MQ7_CO_b -1.518

#define MQ7_Alcohol_a 40000000000000000
#define MQ7_Alcohol_b -12.35

/* ********************* MQ135 ***************************************************** */
// Datasheet: https://robokits.download/downloads/MQ-135.pdf

#define defaultMQ135 "NH4"
#define RatioMQ135CleanAir 3.6 // RS / R0 = 3.6 ppm
#define R0_MQ135 76.63         // R0 after 48 hours pre-heating the sensor

#define MQ135_CO_a 605.18
#define MQ135_CO_b -3.937

#define MQ135_Alcohol_a 77.255
#define MQ135_Alcohol_b -3.18

#define MQ135_CO2_a 110.47
#define MQ135_CO2_b -2.862

#define MQ135_Tolueno_a 44.947
#define MQ135_Tolueno_b -3.445

#define MQ135_NH4_a 102.2
#define MQ135_NH4_b -2.473

#define MQ135_Acetona_a 34.668
#define MQ135_Acetona_b -3.369

/* ******************************************************************************* */

class MQSensor : public AnalogSensor
{
public:
  MQSensor(char *id, char *name, char *category, int pin, int type);

  void setup();

  void setR0(double R0 = 10);
  float calibrate();
  void setGasCompoundPairValue(String compound);

  double getR0();
  double getRL();
  double getVoltage();
  float getSensorReading(String compound);

protected:
  int _type;

  double _sensor_voltage;
  double _ratioInCleanAir;
  float _VOLTAGE_RESOLUTION = 5.0; // if 3.3v use 3.3
  float _RLValue = 10;             // Load Resistance Value in KiloOhms
  float _R0;
  float _RS_Calc;
  float _ratio;
  float _PPM;

  double _a;
  float _b;
  String _compound;
};