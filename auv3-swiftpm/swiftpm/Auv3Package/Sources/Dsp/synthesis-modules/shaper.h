#pragma once
#include "../base/synthesis-bus.h"
#include "../dsp-modules/basic/interpolator.h"
#include "../dsp-modules/filters/oversampling-stage.h"
#include "funcs/shaper-funcs.h"
#include <memory>

namespace dsp {

class Shaper {
private:
  SynthesisBus &bus;
  std::unique_ptr<OversamplingStage> oversamplingStage;
  constexpr static int ovsRate = 4;
  Interpolator miLevel;

public:
  explicit Shaper(SynthesisBus &bus)
      : bus(bus),
        oversamplingStage(std::make_unique<OversamplingStage>(ovsRate, 1.0f)) {}

  void prepare(int maxFrames) { oversamplingStage->ensureAllocated(maxFrames); }

  void processSamples(float *buffer, int len) {
    const auto &sp = bus.parameters;
    const ShaperMode shaperMode = sp.shaperMode;

    float *highResBuffer = oversamplingStage->readIn(buffer, len, true);
    if (!highResBuffer)
      return;
    const int hLen = len * ovsRate;
    miLevel.feed(sp.shaperLevel, hLen);
    for (int i = 0; i < hLen; i++) {
      float level = miLevel.advance();
      highResBuffer[i] = applyShaper(highResBuffer[i], level, shaperMode);
    }

    oversamplingStage->writeOut();
  }
};

} // namespace dsp
