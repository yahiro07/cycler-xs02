#include "../../utils/math-utils.h"
#include "../../utils/number-utils.h"

namespace dsp {

inline void debugFillNoise(float *buffer, int len) {
  for (auto i = 0; i < len; i++) {
    buffer[i] = m_random() * 0.1f;
  }
}

inline void debugFillSine(float *buffer, int len, float freq,
                          float sampleRate) {
  static float phase = 0.f;
  float delta = freq / sampleRate;
  for (auto i = 0; i < len; i++) {
    buffer[i] = m_sin(phase * m_two_pi);
    phase = fracPart(phase + delta);
  }
}

} // namespace dsp
