#pragma once
#include "../base/synthesis-bus.h"
#include "../dsp-modules/basic/sequence-helper.h"
#include "../dsp-modules/effects/delay-line-ring-buffer.h"
#include "../motions/funcs/steps-common.h"
#include "../utils/number-utils.h"

namespace dsp {

class StepDelay {
private:
  SynthesisBus &bus;
  DelayLineRingBuffer delayLine;

public:
  explicit StepDelay(SynthesisBus &bus) : bus(bus) {}

  void prepare() {
    constexpr float delayMaxTimeSec = 1.0f;
    const int delayLineLength =
        static_cast<int>(bus.sampleRate * delayMaxTimeSec);
    delayLine.ensureSize(delayLineLength);
  }

  void processSamples(float *buffer, int len) {
    const auto &sp = bus.parameters;
    if (!sp.stepDelayOn)
      return;

    if (bus.gateTriggered) {
      delayLine.clear();
    }

    const int delayLineLength = delayLine.size();
    const int steps = getStepPeriodForDelay(sp.stepDelayStep);
    int delayPos = calcNumSamplesForSteps(bus.bpm, bus.sampleRate, steps);
    delayPos =
        static_cast<int>(clampValue(static_cast<float>(delayPos), 1.0f,
                                    static_cast<float>(delayLineLength - 1)));

    for (int i = 0; i < len; i++) {
      float y = buffer[i];
      const float dry = y;
      const float yd = delayLine.take(delayPos);
      const float wet = y + yd * power2(sp.stepDelayFeed) * 0.9f;
      y = mixValue(dry, wet, sp.stepDelayMix);
      buffer[i] = y;
      delayLine.push(y);
    }
  }
};

} // namespace dsp
