#pragma once
#include "../base/synthesis-bus.h"
#include "../dsp-modules/basic/interpolator.h"

namespace dsp {

class VoicingAmp {
private:
  Bus& bus;
  Interpolator miGain;
  
public:
  VoicingAmp(Bus& b) : bus(b) {}
  
  void reset() {
    miGain.reset();
  }
  
  void processSamples(float* buffer, int len) {
    const SynthParametersSuit& sp = bus.parameters;
    const SynthesisIntermediateState& interm = bus.interm;
    
    float g = 0.0f;
    if (bus.gateOn) g = 1.0f;
    if (sp.ampOn) {
      g *= interm.ampGain;
    }
    miGain.feed(g, len);
    for (int i = 0; i < len; i++) {
      float gain = miGain.advance();
      buffer[i] *= gain;
    }
  }
};

} // namespace dsp
