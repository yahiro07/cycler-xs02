#pragma once
#include "../base/parameter-defs.h"
#include "../base/synthesis-bus.h"
#include "../dsp-modules/basic/interpolator.h"
#include "../dsp-modules/oscillators/bl-wave-provider.h"
#include "../utils/number-utils.h"
#include "funcs/phase-modifiers.h"

namespace dsp {

class OscillatorCore {
private:
  Bus &bus;
  float phase;
  Interpolator miPhaseDelta;
  Interpolator miColor;

  BlWaveWaveform mapBl2Waveform(OscWave wave) {
    switch (wave) {
    case OscWave::saw:
      return BlWaveWaveform::saw;
    case OscWave::rect:
      return BlWaveWaveform::rect;
    case OscWave::tri:
      return BlWaveWaveform::tri;
    case OscWave::sine:
      return BlWaveWaveform::sine;
    }
    return BlWaveWaveform::sine;
  }

public:
  OscillatorCore(Bus &b) : bus(b), phase(0.0f) {}

  void reset() { phase = 0.0f; }

  void processSamples(float *destBuffer, int len, float normFreq, float gain) {
    const SynthParametersSuit &sp = bus.parameters;
    const SynthesisIntermediateState &interm = bus.interm;

    miPhaseDelta.feed(normFreq, len);
    miColor.feed(interm.pmxOscColor, len);

    for (int i = 0; i < len; i++) {
      float phaseDelta = miPhaseDelta.advance();
      float prColor = miColor.advance();

      BlWaveWaveform wave = mapBl2Waveform(sp.oscWave);
      float ph = fracPart(phase);
      float speedRate = 1.0f;
      auto [modPhase, sr] = modifyPhaseWithColor(ph, prColor, sp.oscColorMode);
      speedRate = sr;

      float y = blWaveProvider.getWaveformSample(wave, modPhase,
                                                 phaseDelta * speedRate);
      destBuffer[i] += y * gain;
      phase += phaseDelta;
    }
  }
};

} // namespace dsp
