#pragma once
#include "../../base/parameter-defs.h"
#include "../../utils/math-utils.h"
#include "../../utils/number-utils.h"
#include <vector>

namespace dsp {

constexpr int dn = -12;

static const std::vector<float> map1Notes = {dn, dn + 3, dn + 7, 0, 3, 7, 12};

static const std::vector<float> map2Notes = {
    dn + 0, dn + 2, dn + 3, dn + 5, dn + 7, dn + 8, dn + 10, 0,
    2,      3,      5,      7,      8,      10,     12};
static const auto map3Notes = std::vector<float>{
    dn, dn + 1, dn + 4, dn + 5, dn + 7, dn + 10, 0, 1, 4, 5, 7, 10, 12};

static const std::vector<float> ratioValues = {1.0f, 1.0f / 2.0f, 1.0f / 3.0f,
                                               1.0f / 4.0f};

inline float mapParamOscPitchToRelativeNote(float prPitch,
                                            OscPitchMode pitchMode) {
  if (pitchMode == OscPitchMode::octave) {
    return static_cast<float>(mapUnaryToInt(prPitch, -2, 2) * 12);
  } else if (pitchMode == OscPitchMode::oct_x) {
    return m_floor(mapUnaryTo(prPitch, -2.0f, 2.0f)) * 12.0f;
  } else if (pitchMode == OscPitchMode::semi) {
    constexpr int d = 6;
    return static_cast<float>(mapUnaryToInt(prPitch, -d, d));
  } else if (pitchMode == OscPitchMode::linear) {
    constexpr float d = 2.0f;
    return mapUnaryTo(prPitch, -12.0f * d, 12.0f * d);
  } else if (pitchMode == OscPitchMode::ratio) {
    float ratio = 1.0f;
    if (prPitch > 0.5f) {
      const float pos = (prPitch - 0.5f) * 2.0f;
      ratio = static_cast<float>(mapUnaryToInt(pos, 1, 8));
    } else {
      const float pos = (0.5f - prPitch) * 2.0f;
      ratio = mapUnaryToValues(pos, ratioValues);
    }
    return 12.0f * m_log2(ratio);
  } else if (pitchMode == OscPitchMode::map1) {
    return static_cast<float>(mapUnaryToValues(prPitch, map1Notes));
  } else if (pitchMode == OscPitchMode::map2) {
    return static_cast<float>(mapUnaryToValues(prPitch, map2Notes));
  } else if (pitchMode == OscPitchMode::map3) {
    return static_cast<float>(mapUnaryToValues(prPitch, map3Notes));
  }
  return 0.0f;
}

inline float mapParamOscPitchToOctXCrossMixRateKey(float prPitch) {
  const float octave = mapUnaryTo(prPitch, -2.0f, 2.0f);
  return clampValue(octave + 2.0f, 0.0f, 4.0f);
}

} // namespace dsp
