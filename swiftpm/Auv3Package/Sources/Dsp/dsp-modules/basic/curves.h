#pragma once
#include "../../utils/math-utils.h"
#include "../../utils/number-utils.h"

namespace dsp {

class CurveMapper {
public:
  static float riseSine(float x) { return m_sin(x * m_pi * 0.5f); }

  static float fallSine(float x) { return 1.0f - m_sin(x * m_pi * 0.5f); }

  static float riseInvCosine(float x) { return 0.5f - 0.5f * m_cos(x * m_pi); }

  static float riseInvCosineTight(float x) {
    float y = m_cos(x * m_pi);
    y = invPower2(m_abs(y)) * m_sign(y);
    return 0.5f - 0.5f * y;
  }
};

inline const CurveMapper curveMapper;

class GlideCurves {
public:
  static float glide1(float pp, float a, bool tight = false) {
    if (pp < a) {
      if (tight) {
        return CurveMapper::riseInvCosineTight(pp / a);
      } else {
        return CurveMapper::riseInvCosine(pp / a);
      }
    } else {
      return 1.0f;
    }
  }

  static float glide2(float pp, float a) {
    if (pp < a) {
      return invPower2(pp / a);
    } else {
      return 1.0f;
    }
  }

  static float glide3(float pp, float a) {
    if (pp < a) {
      return mapInvExpCurve(pp / a);
    } else {
      return 1.0f;
    }
  }

private:
  static float mapInvExpCurve(float x, float scaler = 4.0f) {
    return 1.0f - mapExpCurve(1.0f - x, scaler);
  }

  static float mapExpCurve(float x, float scaler = 4.0f) {
    return (m_pow(2.0f, x * scaler) - 1.0f) / (m_pow(2.0f, scaler) - 1.0f);
  }
};

inline const GlideCurves glideCurves;

// Helper functions for direct calls
inline float glide1(float pp, float a, bool tight = false) {
  return GlideCurves::glide1(pp, a, tight);
}

inline float glide2(float pp, float a) {
  return GlideCurves::glide2(pp, a);
}

inline float glide3(float pp, float a) {
  return GlideCurves::glide3(pp, a);
}

inline float mapExpCurve(float x, float scaler = 4.0f) {
  return (m_pow(2.0f, x * scaler) - 1.0f) / (m_pow(2.0f, scaler) - 1.0f);
}

inline float mapInvExpCurve(float x, float scaler = 4.0f) {
  return 1.0f - mapExpCurve(1.0f - x, scaler);
}

} // namespace dsp
