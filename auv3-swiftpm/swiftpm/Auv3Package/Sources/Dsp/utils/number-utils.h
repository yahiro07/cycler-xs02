#pragma once
#include "math-utils.h"
#include <vector>

namespace dsp {

inline float clampValue(float val, float lo, float hi) {
  if (val > hi)
    return hi;
  if (val < lo)
    return lo;
  return val;
}

inline float clampValueZeroOne(float val) {
  return clampValue(val, 0.0f, 1.0f);
}

inline float lowClip(float val, float lo) { return m_max(val, lo); }

inline float highClip(float val, float hi) { return m_min(val, hi); }

inline float lowClipZero(float val) { return m_max(val, 0.0f); }

inline float highClipOne(float val) { return m_min(val, 1.0f); }

inline float mapUnaryTo(float val, float d0, float d1) {
  return val * (d1 - d0) + d0;
}

inline float mapUnaryBipolar(float val) { return val * 2.0f - 1.0f; }

inline int mapUnaryToInt(float val, int v1, int v2) {
  return v1 + static_cast<int>(m_round(val * static_cast<float>(v2 - v1)));
}

inline float mapUnaryToValues(float pr, const std::vector<float> &values) {
  int index =
      static_cast<int>(m_round(pr * static_cast<float>(values.size() - 1)));
  return values[index];
}

inline float mapUnaryFrom(float val, float lo, float hi, bool clamp = false) {
  if (hi == lo)
    return lo;
  float v = (val - lo) / (hi - lo);
  if (clamp) {
    return clampValue(v, 0.0f, 1.0f);
  }
  return v;
}

inline float linearInterpolate(float val, float s0, float s1, float d0,
                               float d1, bool applyClamp = false) {
  float res = ((val - s0) / (s1 - s0)) * (d1 - d0) + d0;
  if (applyClamp) {
    float lo = m_min(d0, d1);
    float hi = m_max(d0, d1);
    return clampValue(res, lo, hi);
  }
  return res;
}

inline float mixValue(float a, float b, float m) {
  return (1.0f - m) * a + m * b;
}

// x:-1__1, k:-1__1, positive k for low curve, negative k for high curve
inline float tunableSigmoid(float x, float k) {
  return (x - k * x) / (k - 2.0f * k * m_abs(x) + 1.0f);
}

inline float power2(float x) { return x * x; }

inline float invPower2(float x) { return 1.0f - (1.0f - x) * (1.0f - x); }

inline float invPower2Weak(float x, float a) {
  float y1 = x;
  float y2 = 1.0f - (1.0f - x) * (1.0f - x);
  return mixValue(y1, y2, a);
}

inline float power3(float x) { return x * x * x; }

inline float invPower3(float x) {
  return 1.0f - (1.0f - x) * (1.0f - x) * (1.0f - x);
}

inline float power4(float x) { return x * x * x * x; }

inline float invPower4(float x) {
  return 1.0f - (1.0f - x) * (1.0f - x) * (1.0f - x) * (1.0f - x);
}

inline float fracPart(float x) { return x - m_floor(x); }

} // namespace dsp
