class Mux {
  public:
    Mux(int selector_pin_0, int selector_pin_1, int selector_pin_2);

    virtual void setup();
    virtual void switchChannel(int channel);

  protected:
    int _selector_pin_0;
    int _selector_pin_1;
    int _selector_pin_2;
};