#pragma once
#include "../base/synthesis-bus.h"
#include "../dsp-modules/effects/phaser.h"
#include "../utils/number-utils.h"

namespace dsp {

class Phaser {
private:
  SynthesisBus &bus;
  PhaserAllPass4 phaserCore;

  float getCutoffNormFreq(float prLevel, float sampleRate) const {
    const float freq = mapUnaryTo(power2(prLevel), 50.0f, 4000.0f);
    return freq / sampleRate;
  }

public:
  explicit Phaser(SynthesisBus &bus) : bus(bus) {}

  void processSamples(float *buffer, int len) {
    const auto &sp = bus.parameters;
    const auto &interm = bus.interm;
    if (!sp.phaserOn)
      return;

    const float prLevel = interm.pmxPhaserLevel;
    const float cutoffNormFreq = getCutoffNormFreq(prLevel, bus.sampleRate);
    phaserCore.processSamples(buffer, len, cutoffNormFreq, 0.5f);
  }
};

} // namespace dsp
