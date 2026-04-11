#pragma once
#include "./base/api.h"

namespace dsp {

class SynthesizerRoot : public IDspCore {

public:
  void prepareProcessing(float sampleRate, int maxFrameLength) override {}

  void setParameter(uint64_t id, float value) override {}

  void noteOn(int noteNumber, float velocity) override {}
  void noteOff(int noteNumber) override {}

  void processAudio(float *leftBuffer, float *rightBuffer,
                    int frames) override {}

  void applyCommand(uint64_t id, float value) override {}

  bool extraLogic_pullRandomizeRequestFlag() override { return false; }
  void extraLogic_randomizeParameters(
      std::map<uint64_t, float> &parameters) override {}
};
} // namespace dsp