#pragma once
#include "../../utils/math-utils.h"
#include "../../utils/number-utils.h"

namespace dsp {

inline int calculateWaveFrameSize(int numHarmonics) {
  float n = m_pow(2.0f, m_ceil(m_log2(static_cast<float>(numHarmonics))));
  return static_cast<int>(clampValue(n * 8.0f, 64.0f, 2048.0f));
}

inline float readWaveFrameInterpolated(const float *buffer, int size,
                                       float pp) {
  pp = pp - m_floor(pp);
  float fIndex = pp * static_cast<float>(size);
  int idx0 = static_cast<int>(fIndex);
  int idx1 = (idx0 + 1) % size;
  float frac = fIndex - static_cast<float>(idx0);
  return mixValue(buffer[idx0], buffer[idx1], frac);
}

} // namespace dsp
