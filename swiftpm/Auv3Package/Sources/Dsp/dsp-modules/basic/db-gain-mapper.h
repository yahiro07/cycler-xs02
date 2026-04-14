#pragma once
#include "../../base/master-gain-config.h"
#include "../../utils/math-utils.h"
#include "../../utils/number-utils.h"

namespace dsp {

struct GainConfig {
  float levelCenter;
  float dbLo;
  float dbHi;
};

inline float mapDbGain(float level, const GainConfig &gainConfig) {
  const float &levelCenter = gainConfig.levelCenter;
  const float &dbLo = gainConfig.dbLo;
  const float &dbHi = gainConfig.dbHi;
  const float cp = levelCenter;
  float db = 1.0f;
  if (level < 0.001f)
    return 0.0f;
  if (level < cp) {
    db = linearInterpolate(level, cp, 0.0f, 0.0f, dbLo);
  } else {
    db = linearInterpolate(level, cp, 1.0f, 0.0f, dbHi);
  }
  return m_pow(10.0f, db / 20.0f);
}

inline float mapDbGain(float level, const MasterGainConfig &gainConfig) {
  const GainConfig cfg = {gainConfig.levelCenter, gainConfig.dbLo,
                          gainConfig.dbHi};
  return mapDbGain(level, cfg);
}

} // namespace dsp
