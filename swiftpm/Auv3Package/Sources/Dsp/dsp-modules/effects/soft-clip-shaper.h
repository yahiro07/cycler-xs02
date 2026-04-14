#pragma once
#include "../../utils/math-utils.h"
#include "../../utils/number-utils.h"

namespace dsp {

inline float applyHardClip(float x, float a = 1.0f) {
  return clampValue(x, -a, a);
}

inline float applySoftClip(float x) {
  const float sqrt2 = m_sqrt2;
  x = clampValue(x, -sqrt2, sqrt2);
  return x - (x * x * x) / 6.0f;
}

inline float applySoftClipAt(float x, float a) {
  return applySoftClip(x / a) * a;
}

} // namespace dsp
