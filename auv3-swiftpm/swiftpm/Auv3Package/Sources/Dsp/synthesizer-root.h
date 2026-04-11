#pragma once
#include "./base/api.h"

namespace dsp {

class SynthesizerRoot : public IDspCore {

public:
  void prepareProcessing(double sampleRate, uint32_t maxFrameLength) override {}

  void setParameter(uint64_t id, double value) override {}

  void noteOn(int noteNumber, double velocity) override {}
  void noteOff(int noteNumber) override {}

  void processAudio(float *leftBuffer, float *rightBuffer,
                    uint32_t frames) override {}

  void applyCommand(uint64_t id, double value) override {}

  bool extraLogic_pullRandomizeRequestFlag() override { return false; }
  void extraLogic_randomizeParameters(
      std::map<uint64_t, double> &parameters) override {}
};
} // namespace dsp