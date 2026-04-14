#pragma once
#include "../basic/buffer-functions.h"
#include <vector>

namespace dsp {

class DelayLineRingBuffer {
private:
  std::vector<float> buffer;
  int bufferLength;
  int wi;

public:
  DelayLineRingBuffer() : bufferLength(1), wi(0) { buffer.resize(1, 0.0f); }

  int size() const { return bufferLength; }

  void ensureSize(int length) {
    if (length != static_cast<int>(buffer.size())) {
      buffer.resize(length, 0.0f);
      bufferLength = length;
      wi = 0;
    }
  }

  void clear() { std::fill(buffer.begin(), buffer.end(), 0.0f); }

  void push(float x) {
    buffer[wi++] = x;
    if (wi >= bufferLength) {
      wi = 0;
    }
  }

  float take(float i) {
    if (i < 0 || i >= bufferLength) {
      return 0.0f;
    }
    float fIndex = fmodf(wi - 1 - i + bufferLength, bufferLength);
    return readBufferInterpolated(buffer.data(), bufferLength, fIndex);
  }
};

} // namespace dsp
