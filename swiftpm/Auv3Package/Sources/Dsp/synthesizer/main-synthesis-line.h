#pragma once
#include "../base/synthesis-bus.h"
#include "../synthesis-modules/delay.h"
#include "../synthesis-modules/filter.h"
#include "../synthesis-modules/oscillators.h"
#include "../synthesis-modules/phaser.h"
#include "../synthesis-modules/shaper.h"
#include "../synthesis-modules/step-delay.h"
#include "../synthesis-modules/voicing-amp.h"

namespace dsp {

class MainSynthesisLine {
private:
  SynthesisBus &bus;
  Oscillators oscillators;
  Filter filter;
  VoicingAmp voicingAmp;
  Shaper shaper;
  Phaser phaser;
  Delay delay;
  StepDelay stepDelay;

public:
  explicit MainSynthesisLine(SynthesisBus &bus)
      : bus(bus), oscillators(bus), filter(bus), voicingAmp(bus), shaper(bus),
        phaser(bus), delay(bus), stepDelay(bus) {}

  void prepare() {
    oscillators.prepare();
    shaper.prepare(bus.maxFrames);
    delay.prepare();
    stepDelay.prepare();
  }

  void reset() {
    oscillators.reset();
    filter.reset();
    voicingAmp.reset();
  }

  void processSamples(float *buffer, int len) {
    oscillators.processSamples(buffer, len);
    filter.processSamples(buffer, len);
    shaper.processSamples(buffer, len);
    voicingAmp.processSamples(buffer, len);
    phaser.processSamples(buffer, len);
    delay.processSamples(buffer, len);
    stepDelay.processSamples(buffer, len);
  }
};

} // namespace dsp
