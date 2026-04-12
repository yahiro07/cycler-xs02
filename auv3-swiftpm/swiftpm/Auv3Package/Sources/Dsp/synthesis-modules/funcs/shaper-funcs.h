#pragma once
#include "../../base/parameter-defs.h"
#include "../../utils/math-utils.h"
#include "../../utils/number-utils.h"

namespace dsp {

namespace ShaperCore {
  inline float foldSine(float x) {
    return m_sin(x * m_pi * 0.5f);
  }
  
  inline float foldTriangle(float x) {
    float t = fmodf(fmodf(x + 1.0f, 4.0f) + 4.0f, 4.0f);
    return t < 2.0f ? t - 1.0f : 3.0f - t;
  }
  
  inline float foldSawHalf(float x) {
    float sign = m_sign(x);
    float level = m_abs(x);
    level = fmodf(level, 1.0f);
    return sign * level;
  }
  
  inline float foldPolyHalf(float _x) {
    float sign = m_sign(_x);
    float x = m_abs(_x);
    if (x < 1.0f) return x;
    if (x < 2.0f) return 1.0f;
    float y = (static_cast<int>(x / 2.0f) & 1) == 0 ? 1.0f : 0.0f;
    return sign * y;
  }
  
  inline float foldBlend(float x, float a) {
    float f = foldTriangle(x);
    float s = m_sin(x * m_pi * 2.0f);
    return mixValue(f, s, a);
  }
}

inline float applyShaper(float x, float prLevel, ShaperMode shaperMode) {
  prLevel = power3(prLevel) / 2.0f;
  const float sc = 1.0f;
  
  switch (shaperMode) {
    case ShaperMode::ws1: {
      float y = x * (1.0f + prLevel * 48.0f * sc);
      return ShaperCore::foldSine(y);
    }
    case ShaperMode::ws2: {
      float y = x * (1.0f + prLevel * 16.0f * sc);
      return ShaperCore::foldSawHalf(y);
    }
    case ShaperMode::ws3: {
      float y = x * (1.0f + prLevel * 16.0f * sc);
      return ShaperCore::foldPolyHalf(y);
    }
    case ShaperMode::ws4: {
      float y = x * (1.0f + prLevel * 24.0f * sc);
      return ShaperCore::foldBlend(y, prLevel);
    }
    case ShaperMode::ws5: {
      float y = x * (1.0f + prLevel * 24.0f * sc);
      return ShaperCore::foldTriangle(y);
    }
  }
  return x;
}

} // namespace dsp
