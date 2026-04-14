#pragma once
#include <cstdint>
#include <map>

namespace dsp {

class IDspCore {
public:
  virtual ~IDspCore() = default;
  // main thread
  virtual void prepareProcessing(float sampleRate, int maxFrames) = 0;

  // audio thread
  virtual void setParameter(uint64_t id, float value) = 0;
  virtual void noteOn(int noteNumber, float velocity) = 0;
  virtual void noteOff(int noteNumber) = 0;
  virtual void processAudio(float *bufferL, float *bufferR, int frames) = 0;
  virtual void applyCommand(uint64_t id, float value) = 0;

  // main thread
  virtual bool extraLogic_pullRandomizeRequestFlag() = 0;
  virtual void
  extraLogic_randomizeParameters(std::map<uint64_t, float> &parameters) = 0;
};

} // namespace dsp