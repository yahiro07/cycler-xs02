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
  bool hostPlaystate = false;
  bool playState = false;

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

  void applyCommand(uint64_t _id, float value) override {
    auto id = static_cast<CommandId>(_id);
    if (id == CommandId::setHostPlayState) {
      hostPlaystate = value > 0.5f;
      hub.setGroovePlaying(hostPlaystate && playState);
    } else if (id == (CommandId::setPlayState)) {
      playState = value > 0.5f;
      hub.setGroovePlaying(hostPlaystate && playState);
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