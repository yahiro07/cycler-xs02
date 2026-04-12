#pragma once
#include "../../base/parameter-defs.h"
#include "../../utils/math-utils.h"
#include "../../utils/number-utils.h"
#include <vector>

namespace dsp {

inline std::vector<float> getRandomSequence() {
  static std::vector<float> seq;
  if (seq.empty()) {
    seq.resize(200);
    for (int i = 0; i < 200; i++) {
      seq[i] = m_random();
    }
  }
  return seq;
}

inline std::pair<float, float> modifyPhaseWithColor(float phase, float prColor,
                                                    OscColorMode colorMode) {
  switch (colorMode) {
  case OscColorMode::sfm: {
    float fmRatio = mapUnaryTo(prColor, 1.0f, 4.0f);
    float fmDepth = prColor * 2.0f;
    float fmOscValue = m_sin(phase * m_two_pi * fmRatio);
    float modPhase = fracPart(phase + fmOscValue * fmDepth);
    float maxSlope = 1.0f + m_two_pi * fmDepth * fmRatio;
    return {modPhase, maxSlope};
  }
  case OscColorMode::speed: {
    float speedRate = 1.0f + prColor * 7.0f;
    float modPhase = fracPart(phase * speedRate);
    return {modPhase, speedRate};
  }
  case OscColorMode::accel: {
    float speedRate = 1.0f + power2(phase) * prColor * 15.0f;
    float modPhase = fracPart(phase * speedRate);
    return {modPhase, speedRate};
  }
  case OscColorMode::drill: {
    float a = mapUnaryTo(prColor, 0.25f, 1.0f);
    float x = phase;
    float speedRate = 1.0f + power2(a) * 15.0f;
    float x1Raw = x * speedRate;
    float x1 = fracPart(x1Raw);
    float y1 = (x1 < 0.5f) ? 0.0f : 1.0f;
    if (x1Raw < 2.0f)
      y1 = 1.0f;
    float modPhase = x * y1;
    return {modPhase, 1.0f};
  }
  case OscColorMode::sdm: {
    float speedRate = mapUnaryTo(prColor, 1.0f, 100.0f);
    float indexF = phase * speedRate;
    int i0 = static_cast<int>(m_floor(indexF));
    int i1 = i0 + 1;
    float m = indexF - static_cast<float>(i0);
    float y1 = phase;
    const auto &randomSequence = getRandomSequence();
    float y2 = mixValue((i0 == 0) ? 0.0f : randomSequence[i0 % 200],
                        randomSequence[i1 % 200], m);
    float y3 = mixValue(y1, y2, prColor);
    float modPhase = mixValue(y1, y3, prColor);
    return {modPhase, speedRate};
  }
  case OscColorMode::creep: {
    float speedRate = 1.0f + prColor * 31.0f;
    float gainRight = mapUnaryTo(prColor, 1.0f, 0.0f);
    float y = -m_cos(invPower2(phase) * m_pi * speedRate) * 0.5f + 0.5f;
    float gain = mapUnaryTo(phase, 1.0f, gainRight);
    float gain2 = mapUnaryTo(invPower2(prColor), 1.0f, 1.07f);
    float modPhase = clampValueZeroOne(y * gain * gain2);
    return {modPhase, speedRate};
  }
  case OscColorMode::sinus: {
    float modPhase =
        -m_cos(phase * m_pi * (1.0f + prColor * 15.0f)) * 0.5f + 0.5f;
    float maxSlope = m_half_pi * (1.0f + prColor * 15.0f);
    return {modPhase, maxSlope};
  }
  case OscColorMode::ridge: {
    float speedRate = 1.0f + prColor * 15.0f;
    float modPhase = m_abs(m_sin(phase * m_half_pi * speedRate));
    return {modPhase, speedRate};
  }
  }
  return {phase, 1.0f};
}

} // namespace dsp
