#pragma once
#include "../../utils/math-utils.h"
#include "../../utils/number-utils.h"

namespace dsp {

enum class PdOscWave {
  saw,
  rect,
  tri,
  sine,
};

inline float getOscWaveformPd(float _phase, PdOscWave wave, float pdLevel,
                              bool narrow = false) {
  if (wave == PdOscWave::saw) {
    const float sr = 0.5f;
    const float bp = sr * (1.0f - pdLevel * 0.95f);
    const float phaseShift = bp / 2.0f;
    float phase = _phase + phaseShift;
    phase = phase - m_floor(phase);
    float pp = 0.0f;
    if (phase < bp) {
      float t = phase / bp;
      pp = t * sr;
    } else {
      float t = (phase - bp) / (1.0f - bp);
      pp = sr + t * (1.0f - sr);
    }
    if (narrow) {
      return m_sin(pp * m_pi * 2.0f);
    } else {
      return -m_cos(pp * m_pi * 2.0f);
    }
  } else if (wave == PdOscWave::rect) {
    float phase = _phase;
    float phase1 = (phase - m_floor(phase / 0.5f) * 0.5f) * 2.0f;
    const float bw = pdLevel * 0.45f;
    float y = 0.0f;
    if (phase1 < 0.5f - bw) {
      y = (phase1 / (0.5f - bw)) * 0.5f;
    } else if (phase1 > 0.5f + bw) {
      y = linearInterpolate(phase1, 0.5f + bw, 1.0f, 0.5f, 1.0f);
    } else {
      y = 0.5f;
    }
    y *= 0.5f;
    float y2 = (phase - m_floor(phase)) > 0.5f ? 0.5f + y : y;
    if (narrow) {
      return -m_cos(y2 * m_pi * 2.0f);
    } else {
      return m_sin(y2 * m_pi * 2.0f);
    }
  } else if (wave == PdOscWave::tri) {
    float phase = _phase - m_floor(_phase);
    // Alternative implementation as PD doesn't work well for triangle
    float y = 0.0f;
    if (phase < 0.25f) {
      y = 4.0f * phase;
    } else if (phase > 0.75f) {
      y = -4.0f + phase * 4.0f;
    } else {
      y = 2.0f - 4.0f * phase;
    }
    float sine = m_sin(phase * m_pi * 2.0f);
    return mixValue(sine, y, pdLevel);
  } else {
    float phase = _phase - m_floor(_phase);
    return m_sin(phase * m_pi * 2.0f);
  }
}

} // namespace dsp
