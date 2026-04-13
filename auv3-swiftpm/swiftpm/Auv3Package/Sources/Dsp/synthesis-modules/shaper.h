#pragma once
#include "../base/synthesis-bus.h"
#include "../dsp-modules/basic/interpolator.h"
#include "../dsp-modules/filters/oversampling-stage.h"
#include "funcs/shaper-funcs.h"

namespace dsp {

class Shaper {
private:
  constexpr static int ovsRate = 4;
  SynthesisBus &bus;
  OversamplingStage oversamplingStage{ovsRate, 1.0f};
  Interpolator miLevel;

public:
  explicit Shaper(SynthesisBus &bus) : bus(bus) {}
  void prepare(int maxFrames) { oversamplingStage.ensureAllocated(maxFrames); }

  void processSamples(float *buffer, int len) {
    auto &sp = bus.parameters;
    if (!sp.shaperOn)
      return;
    float *highResBuffer = oversamplingStage.readIn(buffer, len, true);
    if (!highResBuffer)
      return;
    int hLen = len * ovsRate;
    miLevel.feed(sp.shaperLevel, hLen);
    for (int i = 0; i < hLen; i++) {
      float level = miLevel.advance();
      float input = highResBuffer[i];
      float y = applyShaper(input, level, sp.shaperMode);
      highResBuffer[i] = y;
    }

    oversamplingStage.writeOut();
  }
};

} // namespace dsp
