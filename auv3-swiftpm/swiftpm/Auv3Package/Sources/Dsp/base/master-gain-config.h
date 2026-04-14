#pragma once

namespace dsp {

struct MasterGainConfig {
  float levelCenter;
  float dbLo;
  float dbHi;
  float prescale;
};

inline const MasterGainConfig masterGainConfig = {
    0.5f,   // levelCenter
    -40.0f, // dbLo
    12.0f,  // dbHi
    0.3f,   // prescale
};

} // namespace dsp
