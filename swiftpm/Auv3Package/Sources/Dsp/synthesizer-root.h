#pragma once
#include "./base/api.h"
#include "./base/parameter-id.h"
#include "./parameters/parameter-assigner.h"
#include "./parameters/parameter-randomizer.h"
#include "./synthesizer/synthesizer-hub.h"

namespace dsp {

class SynthesizerRoot : public IDspCore {
private:
  SynthesizerHub hub;

public:
  SynthesizerRoot() = default;

  void prepareProcessing(float sampleRate, int maxFrameLength) override {
    hub.prepare(sampleRate);
  }

  void setParameter(uint64_t id, float value) override {
    parameterAssigner_applyParameter(hub.getBus(), id, value);
  }

  void noteOn(int noteNumber, float velocity) override {
    hub.noteOn(noteNumber);
  }

  void noteOff(int noteNumber) override { hub.noteOff(noteNumber); }

  void processAudio(float *leftBuffer, float *rightBuffer,
                    int frames) override {
    hub.processSamples(leftBuffer, frames);
    memcpy(rightBuffer, leftBuffer, frames * sizeof(float));
  }

  void applyCommand(uint64_t id, float value) override {
    if (id == static_cast<uint64_t>(CommandId::setPlayState)) {
      hub.setGroovePlaying(value > 0.5f);
    }
  }

  bool extraLogic_pullRandomizeRequestFlag() override {
    bool expected = true;
    return hub.getBus().randomizationRequestFlag.compare_exchange_strong(
        expected, false);
  }

  void extraLogic_randomizeParameters(
      std::map<uint64_t, float> &parameters) override {
    applyRandomizeParameters(parameters);
  }
};

} // namespace dsp