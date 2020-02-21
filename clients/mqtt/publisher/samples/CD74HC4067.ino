#include <CD74HC4067.h>
#include <ESP8266WiFi.h>
#include <ThingerESP8266.h>

#define USERNAME "username"
#define DEVICE_ID "deviceid"
#define DEVICE_CREDENTIAL "credential"

#define SSID "ssid"
#define SSID_PASSWORD "password"

ThingerESP8266 thing(USERNAME, DEVICE_ID, DEVICE_CREDENTIAL);

/*
CD74HC4067 Analog / Digital Multiplexing

This sketch reads analog values from all 16 of the multiplexer pins.

created 17 Nov 2009
by Rory Nugent

The following pins must be connected:

Digital Pin 2 -> S0
Digital Pin 3 -> S1
Digital Pin 4 -> S3
Digital Pin 5 -> S4

Analog In Pin 0 -> SIG

*/

// Mux analog / digital signal pin
#define sig 0 // Analog In Pin 0

// Mux channel select pins
#define setPin0 5 // GPIO 5 (D1 on NodeMCU)
#define setPin1 4 // GPIO 4 (D2 on NodeMCU)
#define setPin2 0 // GPIO 0 (D3 on NodeMCU)
#define setPin3 2 // GPIO 2 (D4 on NodeMCU)

void setup() {
    Serial.begin(9600);

    pinMode(setPin0, OUTPUT);
    pinMode(setPin1, OUTPUT);
    pinMode(setPin2, OUTPUT);
    pinMode(setPin3, OUTPUT);

    thing.add_wifi(SSID, SSID_PASSWORD);
}
void loop() {
    thing.handle();

    // for loop to cycle through all mux channels, 0 - 15
    for (int i = 0; i < 16; i++) {
        int sigValue = readSig(i); // read from a mux channel

        // print the analog / digital value to the serial monitor

        Serial.print("Value at channel ");
        Serial.print(i);
        Serial.print(" is : ");
        Serial.println(readSig(i));
    }
    Serial.println(); // NEW LINE
}

// NAME: readSig
// INPUT: mux channel as an integer, 0 - 15
// RETURN: analog value of the selected mux channel as an integer
int readSig(int channel) {
    // use the first four bits of the channel number to set the channel select
    // pins
    digitalWrite(setPin0, bitRead(channel, 0));
    digitalWrite(setPin1, bitRead(channel, 1));
    digitalWrite(setPin2, bitRead(channel, 2));
    digitalWrite(setPin3, bitRead(channel, 3));

    // read from the selected mux channel
    int sigValue = analogRead(sig);

    // return the received analog value
    return sigValue;

    thing["moisture"] >> [](pson &out) {
        out["moist1"] = (unsigned int)analogRead(readSig(0)), 0, 1023, 0, 100;
        out["moist2"] = (unsigned int)analogRead(readSig(1)), 0, 1023, 0, 100;
        out["moist3"] = (unsigned int)analogRead(readSig(2)), 0, 1023, 0, 100;
        out["moist4"] = (unsigned int)analogRead(readSig(3)), 0, 1023, 0, 100;
    };
}