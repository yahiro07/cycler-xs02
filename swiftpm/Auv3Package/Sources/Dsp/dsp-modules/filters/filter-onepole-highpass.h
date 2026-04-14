#pragma once
#include "../../utils/math-utils.h"

namespace dsp {

class FilterOnePoleHighPass {
private:
  float a1;
  float b0;
  float b1;
  float x1;
  float y1;

public:
  FilterOnePoleHighPass(float sampleRate, float cutoffFreqInHz) {
    a1 = m_exp((-2.0f * m_pi * cutoffFreqInHz) / sampleRate);
    b0 = 0.5f * (1.0f + a1);
    b1 = -0.5f * (1.0f + a1);
    x1 = 0.0f;
    y1 = 0.0f;
  }

  float apply(float x) {
    const float tiny = 1e-32f;
    y1 = b0 * x + b1 * x1 + a1 * y1 + tiny;
    x1 = x;
    return y1;
  }
};

class FilterOnePoleHighPassDynamic {
private:
  float x1;
  float y1;

public:
  FilterOnePoleHighPassDynamic() : x1(0.0f), y1(0.0f) {}

  float apply(float x, float cutoffNormFreq) {
    float a1 = m_exp(-2.0f * m_pi * cutoffNormFreq);
    float b0 = 0.5f * (1.0f + a1);
    float b1 = -0.5f * (1.0f + a1);
    const float tiny = 1e-32f;
    y1 = b0 * x + b1 * x1 + a1 * y1 + tiny;
    x1 = x;
    return y1;
  }
};

} // namespace dsp
