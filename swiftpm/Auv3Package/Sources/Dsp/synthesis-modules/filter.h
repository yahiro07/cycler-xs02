#pragma once
#include "../base/synthesis-bus.h"
#include "../dsp-modules/basic/synthesis-helper.h"
#include "../dsp-modules/filters/filter-biquad-lp12.h"
#include "../utils/number-utils.h"

namespace dsp {

class Filter {
private:
  Bus& bus;
  FilterBiquadLp12 filterBiquadLp12;
  
  float calculateNormalizedCutoffFreq(int noteNumber, float prCutoff, float sampleRate) {
    int bottomNoteNumber = noteNumber - 6;
    int topNoteNumber = 124;
    float cutoffNotePitch = mapUnaryTo(invPower2(prCutoff), static_cast<float>(bottomNoteNumber), static_cast<float>(topNoteNumber));
    float cutoffNormFreq = midiToFrequency(cutoffNotePitch) / sampleRate;
    return clampValue(cutoffNormFreq, 0.0f, 0.49f);
  }
  
public:
  Filter(Bus& b) : bus(b), filterBiquadLp12(b.sampleRate) {}
  
  void reset() {
    filterBiquadLp12.reset();
  }
  
  void processSamples(float* buffer, int len) {
    const SynthParametersSuit& sp = bus.parameters;
    const SynthesisIntermediateState& interm = bus.interm;
    
    if (!sp.filterOn) return;
    
    float prCutoff = interm.pmxFilterPrCutoff;
    float cutoffNormFreq = calculateNormalizedCutoffFreq(bus.noteNumber, prCutoff, bus.sampleRate);
    float prPeak = sp.filterPeak;
    
    filterBiquadLp12.processSamples(buffer, len, cutoffNormFreq, prCutoff, prPeak);
  }
};

} // namespace dsp
