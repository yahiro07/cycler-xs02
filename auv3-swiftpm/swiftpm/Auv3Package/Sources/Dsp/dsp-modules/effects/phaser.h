#pragma once
#include "../../utils/math-utils.h"
#include "../../utils/number-utils.h"

namespace dsp {

class AllPassFilter {
private:
  float in1 = 0.0f;
  float in2 = 0.0f;
  float out1 = 0.0f;
  float out2 = 0.0f;

public:
  float processSample(float _in, float normFreq, float q) {
    const float omega = 2.0f * m_pi * normFreq;
    const float alpha = m_sin(omega) / (2.0f * q);
    const float a0 = 1.0f + alpha;
    const float a1 = -2.0f * m_cos(omega);
    const float a2 = 1.0f - alpha;
    const float b0 = 1.0f - alpha;
    const float b1 = -2.0f * m_cos(omega);
    const float b2 = 1.0f + alpha;

    const float out = (b0 / a0) * _in +
                      (b1 / a0) * in1 +
                      (b2 / a0) * in2 -
                      (a1 / a0) * out1 -
                      (a2 / a0) * out2;
    in2 = in1;
    in1 = _in;
    out2 = out1;
    out1 = out;
    return out;
  }
};

class PhaserAllPass4 {
private:
  AllPassFilter allPasses[4];

public:
  void processSamples(float* buffer, int len, float normFreq, float prMix) {
    for (int i = 0; i < len; i++) {
      const float input = buffer[i];
      const float dry = input;
      float y = input;
      for (int j = 0; j < 4; j++) {
        y = allPasses[j].processSample(y, normFreq, 1.0f);
      }
      const float wet = y;
      buffer[i] = mixValue(dry, wet, prMix);
    }
  }
};

} // namespace dsp
