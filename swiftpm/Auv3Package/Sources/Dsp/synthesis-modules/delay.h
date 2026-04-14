#pragma once
#include "../base/synthesis-bus.h"
#include "../dsp-modules/basic/interpolator.h"
#include "../dsp-modules/effects/delay-line-ring-buffer.h"
#include "../utils/number-utils.h"

namespace dsp {

constexpr float delayMaxTimeSec = 20.0f / 1000.0f;

class Delay {
private:
  Bus &bus;
  DelayLineRingBuffer delayLine;
  Interpolator miDelayPos;
  Interpolator miFeed;

public:
  Delay(Bus &b) : bus(b) {}

  void prepare() {
    int delayLineLength = static_cast<int>(bus.sampleRate * delayMaxTimeSec);
    delayLine.ensureSize(delayLineLength);
  }

  void processSamples(float *buffer, int len) {
    const SynthParametersSuit &sp = bus.parameters;
    const SynthesisIntermediateState &interm = bus.interm;

    if (!sp.delayOn)
      return;

    if (bus.gateTriggered) {
      delayLine.clear();
    }

    int delayLineLength = delayLine.size();
    float prFeed = sp.delayFeed;
    float delayPos = 0.0f;
    float prTime = interm.pmxDelayTime;
    float maxNumSamples = delayMaxTimeSec * bus.sampleRate;
    delayPos = power2(prTime) * maxNumSamples;
    delayPos =
        clampValue(delayPos, 1.0f, static_cast<float>(delayLineLength - 1));

    miDelayPos.feed(delayPos, len);
    miFeed.feed(prFeed, len);

    for (int i = 0; i < len; i++) {
      float dp = miDelayPos.advance();
      float feed = miFeed.advance();
      float input = buffer[i];
      float dry = input;
      float yd = delayLine.take(dp);
      float wet = input + yd * feed * 0.95f;
      float y = mixValue(dry, wet, 0.5f);
      buffer[i] = y;
      delayLine.push(wet);
    }
  }
};

} // namespace dsp
