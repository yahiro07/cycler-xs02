#include <cstdint>

class IDspCore {
public:
  virtual void prepareProcessing(double sampleRate, uint32_t maxFrames);
  virtual void setParameter(uint32_t id, double value);
  virtual void noteOn(int noteNumber, double velocity);
  virtual void noteOff(int noteNumber);
  virtual void processAudio(float *bufferL, float *bufferR, uint32_t frames);
};
