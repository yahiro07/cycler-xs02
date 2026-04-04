#include "dsp-core.h"
#include <cstdlib>

class DspCore : public IDspCore {
public:
  void prepareProcessing(double sampleRate, uint32_t maxFrames) override {}
  void setParameter(uint32_t id, double value) override {}
  void noteOn(int noteNumber, double velocity) override {}
  void noteOff(int noteNumber) override {}
  void processAudio(float *bufferL, float *bufferR, uint32_t frames) override {
    for (uint32_t i = 0; i < frames; i++) {
      const float y = (rand() / (float)RAND_MAX * 2.0 - 1.0) * 0.1;
      bufferL[i] = y;
      bufferR[i] = y;
    }
  }
};

IDspCore *createDspCore() { return new DspCore(); }