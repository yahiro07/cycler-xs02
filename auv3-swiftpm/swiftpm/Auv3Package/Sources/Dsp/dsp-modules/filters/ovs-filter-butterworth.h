#pragma once
#include "../../utils/math-utils.h"
#include <vector>

namespace dsp {

struct BiquadCoeffs {
  float b0, b1, b2, a1, a2;
};

inline std::vector<float> butterworthQs(int order) {
  const int n = m_max(2, order);
  const int m = n / 2;
  std::vector<float> qs;
  qs.reserve(m);
  for (int k = 1; k <= m; k++) {
    const float ang = ((2.0f * k - 1.0f) * m_pi) / (2.0f * n);
    qs.push_back(1.0f / (2.0f * m_cos(ang)));
  }
  return qs;
}

inline BiquadCoeffs createBiquadLpCookbook(float cutoffNormFreq, float Q) {
  const float f = m_clamp(cutoffNormFreq, 0.0001f, 0.49f);
  const float q = m_max(0.1f, Q);

  const float omega = 2.0f * m_pi * f;
  const float sinOmega = m_sin(omega);
  const float cosOmega = m_cos(omega);
  const float alpha = sinOmega / (2.0f * q);

  const float a0 = 1.0f + alpha;
  const float a1 = -2.0f * cosOmega;
  const float a2 = 1.0f - alpha;
  const float b0 = (1.0f - cosOmega) / 2.0f;
  const float b1 = 1.0f - cosOmega;
  const float b2 = (1.0f - cosOmega) / 2.0f;

  return {b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0};
}

class OvsFilterButterworth {
private:
  std::vector<BiquadCoeffs> sections;
  std::vector<float> z1;
  std::vector<float> z2;

public:
  OvsFilterButterworth(int oversampleRatio, float cutoffScale, int order = 8) {
    const int nx = m_max(1, oversampleRatio);
    const int ord = m_max(2, (order / 2) * 2); // force even

    const float fcNormHigh = m_clamp(cutoffScale / (2.0f * nx), 0.0001f, 0.49f);

    const auto qs = butterworthQs(ord);
    sections.reserve(qs.size());
    for (float Q : qs) {
      sections.push_back(createBiquadLpCookbook(fcNormHigh, Q));
    }

    z1.resize(sections.size(), 0.0f);
    z2.resize(sections.size(), 0.0f);
  }

  void processSamples(float *buffer, int len) {
    for (int i = 0; i < len; i++) {
      float x = buffer[i];
      for (size_t s = 0; s < sections.size(); s++) {
        const auto &coeff = sections[s];
        const float w = x - coeff.a1 * z1[s] - coeff.a2 * z2[s];
        const float y = coeff.b0 * w + coeff.b1 * z1[s] + coeff.b2 * z2[s];
        z2[s] = z1[s];
        z1[s] = w;
        x = y;
      }
      buffer[i] = x;
    }
  }

  void reset() {
    std::fill(z1.begin(), z1.end(), 0.0f);
    std::fill(z2.begin(), z2.end(), 0.0f);
  }
};

} // namespace dsp
