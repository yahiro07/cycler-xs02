#pragma once
#include "../../utils/math-utils.h"

namespace dsp {

inline float midiToFrequency(float midiNote) {
  return 440.0f * m_pow(2.0f, (midiNote - 69.0f) / 12.0f);
}

} // namespace dsp
