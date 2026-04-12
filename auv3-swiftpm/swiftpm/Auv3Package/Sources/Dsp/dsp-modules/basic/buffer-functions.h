#pragma once
#include "../../utils/math-utils.h"
#include "../../utils/number-utils.h"
#include "../effects/soft-clip-shaper.h"

namespace dsp {

inline float readBufferInterpolated(const float *buffer, int len,
                                    float fIndex) {
  int idx0 = static_cast<int>(fIndex);
  int idx1 = (idx0 + 1) % len;
  float fraction = fIndex - static_cast<float>(idx0);
  return mixValue(buffer[idx0], buffer[idx1], fraction);
}

inline void copyBuffer(float *dstBuffer, const float *srcBuffer, int len) {
  for (int i = 0; i < len; i++) {
    dstBuffer[i] = srcBuffer[i];
  }
}

inline void writeBuffer(float *dstBuffer, const float *srcBuffer, int len) {
  for (int i = 0; i < len; i++) {
    dstBuffer[i] += srcBuffer[i];
  }
}

inline void writeBufferWithGain(float *dstBuffer, const float *srcBuffer,
                                int len, float volume) {
  for (int i = 0; i < len; i++) {
    dstBuffer[i] += srcBuffer[i] * volume;
  }
}

inline void applyBufferGain(float *buffer, int len, float gain) {
  for (int i = 0; i < len; i++) {
    buffer[i] *= gain;
  }
}

inline void applyBufferGainRms(float *buffer, int len, int numSources) {
  float gain = 1.0f / m_sqrt(static_cast<float>(numSources));
  applyBufferGain(buffer, len, gain);
}

inline void applyBufferGainB(float *buffer, int len, const float *gains) {
  for (int i = 0; i < len; i++) {
    buffer[i] *= gains[i];
  }
}

inline void applyBufferSoftClip(float *buffer, int len) {
  for (int i = 0; i < len; i++) {
    buffer[i] = applySoftClip(buffer[i]);
  }
}

inline void applyBufferHardClip(float *buffer, int len) {
  for (int i = 0; i < len; i++) {
    buffer[i] = applyHardClip(buffer[i]);
  }
}

} // namespace dsp
