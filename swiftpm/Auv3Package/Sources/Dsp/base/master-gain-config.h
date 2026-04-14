#pragma once

namespace dsp {

struct MasterGainConfig {
  float levelCenter;
  float dbLo;
  float dbHi;
  float prescale;
};

inline const MasterGainConfig masterGainConfig = {
    .levelCenter = 0.5f,
    .dbLo = -42.0f,
    .dbHi = 18.0f,
    .prescale = 0.7f,
};

} // namespace dsp
