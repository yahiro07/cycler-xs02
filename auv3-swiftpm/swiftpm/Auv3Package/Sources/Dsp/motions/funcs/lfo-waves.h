#pragma once
#include "../../base/parameter-defs.h"
#include "../../utils/math-utils.h"

namespace dsp {

inline float getLfoWave(LfoWave wave, float x) {
  if (wave == LfoWave::sine) {
    return m_sin(x * m_pi * 2.0f);
  }
  if (wave == LfoWave::rect) {
    return x < 0.5f ? 1.0f : 0.0f;
  }
  if (wave == LfoWave::tri) {
    return x < 0.5f ? 2.0f * x : 2.0f * (1.0f - x);
  }
  if (wave == LfoWave::saw) {
    return 1.0f - x;
  }
  return 0.0f;
}

} // namespace dsp
