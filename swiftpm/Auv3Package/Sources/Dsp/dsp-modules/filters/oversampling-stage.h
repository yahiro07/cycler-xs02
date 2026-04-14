#pragma once
#include "../../utils/math-utils.h"
#include "ovs-filter-butterworth.h"
#include <cstring>
#include <memory>
#include <vector>

namespace dsp {

class OversamplingStage {
private:
  int oversampleRatio;
  int decimateOffset;

  OvsFilterButterworth preFilter;
  OvsFilterButterworth postFilter;

  std::vector<float> highResBuffer;
  float *originalBufferPtr = nullptr;
  int originalLength = 0;

  void zeroStuffUpsampling(float *highRes, const float *original, int origLen,
                           int nx) {
    std::fill(highRes, highRes + origLen * nx, 0.0f);
    for (int i = 0; i < origLen; i++) {
      highRes[i * nx] = original[i] * nx;
    }
  }

  void decimate(const float *highRes, float *original, int origLen, int nx,
                int offset) {
    for (int i = 0; i < origLen; i++) {
      original[i] = highRes[i * nx + offset];
    }
  }

public:
  OversamplingStage(int oversampleRatio, float cutoffScale = 1.0f)
      : oversampleRatio(oversampleRatio),
        decimateOffset(m_max(0, oversampleRatio >> 1)),
        preFilter(OvsFilterButterworth(oversampleRatio, cutoffScale)),
        postFilter(OvsFilterButterworth(oversampleRatio, cutoffScale)) {}

  void ensureAllocated(int maxFrames) {
    const int len = maxFrames * oversampleRatio;
    if (highResBuffer.size() != static_cast<size_t>(len)) {
      highResBuffer.resize(len);
      preFilter.reset();
      postFilter.reset();
    }
  }

  float *readIn(float *originalBuffer, int len, bool chainInput = true) {
    const int nx = oversampleRatio;
    if (highResBuffer.empty())
      return nullptr;

    if (chainInput) {
      zeroStuffUpsampling(highResBuffer.data(), originalBuffer, len, nx);
      preFilter.processSamples(highResBuffer.data(), len * nx);
    } else {
      std::fill(highResBuffer.begin(), highResBuffer.end(), 0.0f);
    }

    originalBufferPtr = originalBuffer;
    originalLength = len;
    return highResBuffer.data();
  }

  void writeOut() {
    if (!originalBufferPtr)
      return;
    const int nx = oversampleRatio;

    postFilter.processSamples(highResBuffer.data(), originalLength * nx);

    decimate(highResBuffer.data(), originalBufferPtr, originalLength, nx,
             decimateOffset);
  }
};

} // namespace dsp
