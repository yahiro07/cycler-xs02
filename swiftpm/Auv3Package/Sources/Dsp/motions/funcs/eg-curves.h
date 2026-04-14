#pragma once
#include "../../base/parameter-defs.h"
#include "../../dsp-modules/basic/curves.h"
#include "../../utils/math-utils.h"
#include "../../utils/number-utils.h"

namespace dsp {

inline float getEgCurve(MoEgWave wave, float pos, float shape) {
  if (wave == MoEgWave::d) {
    const float u = 1.0f - shape;
    const float k = -invPower2(u) * 0.95f;
    return 1.0f - tunableSigmoid(pos, k);
  } else if (wave == MoEgWave::d2) {
    shape = invPower2(shape);
    return m_exp(-50.0f * pos * power3(1.0f - shape * 0.85f));
  } else if (wave == MoEgWave::ad) {
    const float t = pos * 0.125f;
    const float bp = 0.25f * mapUnaryTo(shape, 0.02f, 1.0f);
    const float sus = shape;
    if (t < bp) {
      return sus + (1.0f - sus) * mapExpCurve(1.0f - t / bp, 6.0f);
    }
    return sus;
  } else if (wave == MoEgWave::bump) {
    const float bp = mapUnaryTo(shape, 0.1f, 1.0f);
    if (pos < bp) {
      const float x = (pos / bp - 0.5f) * 2.0f;
      return 1.0f - x * x;
    }
    return 0.0f;
  } else if (wave == MoEgWave::duty) {
    const float bp = mapUnaryTo(shape, 0.1f, 0.9f);
    if (pos < bp) return 1.0f;
    return 0.0f;
  } else if (wave == MoEgWave::stair) {
    const int nStep = mapUnaryToInt(shape, 2, 10);
    const float y = 1.0f - m_floor(pos * nStep) / nStep;
    const float low = 1.0f / nStep;
    const float z = mapUnaryFrom(y, low, 1.0f);
    return clampValueZeroOne(z);
  }
  return 0.0f;
}

inline float getAmpEgCurvePL(float pos, float duty, float decay, float stepDuration = 1.0f) {
  if (duty < 0.05f && decay == 0.0f) {
    // Prevent silence
    duty = 0.05f;
  }
  // Ensure that increasing duty proportionally increases the hold time during a tie
  // (adjustment based on a fixed end time)
  const float bpShort = duty * stepDuration;
  const float bpLong = stepDuration - (1.0f - duty);
  const float bp = mixValue(bpShort, bpLong, duty);
  if (pos <= bp) {
    return 1.0f;
  } else {
    if (decay == 0.0f) return 0.0f;
    if (duty >= 1.0f) return 1.0f;
    const float u = (pos - bp) / (stepDuration - bp);
    return getEgCurve(MoEgWave::d2, u, decay);
  }
}

} // namespace dsp
