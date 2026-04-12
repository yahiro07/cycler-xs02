#pragma once
#include "../../utils/math-utils.h"
#include <vector>

namespace dsp {

inline float deterministicRandom(float seed) {
  static const std::vector<float> randomSequence = []() {
    std::vector<float> seq(1000);
    for (int i = 0; i < 1000; i++) {
      seq[i] = m_random();
    }
    return seq;
  }();

  uint32_t s = static_cast<uint32_t>(m_floor(seed * 65536.0f));
  uint32_t x = m_imul(s ^ 0x9e3779b9, 0x26535761);
  x = x ^ (x >> 16);
  int pos = x % randomSequence.size();
  return randomSequence[pos];
}

} // namespace dsp
