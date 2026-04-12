#pragma once
#include "../../utils/math-utils.h"
#include "../../utils/number-utils.h"
#include "../basic/interpolator.h"
#include "../effects/soft-clip-shaper.h"
#include "filter-onepole-highpass.h"

namespace dsp {

class FilterBiquadLp12 {
private:
  float z1;
  float z2;
  float fbY;
  float sampleRate;
  FilterOnePoleHighPass highPass;

  struct Coefficients {
    float b0;
    float b1;
    float b2;
    float a1;
    float a2;
  };

  Coefficients calculateCoefficients(float cutoffNormFreq, float paramPeak) {
    // Ensure cutoffNormFreq is in valid range
    float freq = clampValue(cutoffNormFreq, 0.0001f, 0.49f);

    // Map paramResonance (0-1) to Q (0.5-20)
    const float minQ = 0.5f;
    const float maxQ = 20.0f;
    float Q = minQ + paramPeak * (maxQ - minQ);

    // Cookbook formula for lowpass biquad
    float omega = m_two_pi * freq;
    float sinOmega = m_sin(omega);
    float cosOmega = m_cos(omega);
    float alpha = sinOmega / (2.0f * Q);

    float a0 = 1.0f + alpha;
    float a1 = -2.0f * cosOmega;
    float a2 = 1.0f - alpha;
    float b0 = (1.0f - cosOmega) / 2.0f;
    float b1 = 1.0f - cosOmega;
    float b2 = (1.0f - cosOmega) / 2.0f;

    // Normalize by a0
    return Coefficients{
        b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0,
    };
  }

public:
  FilterBiquadLp12(float sr)
      : z1(0.0f), z2(0.0f), fbY(0.0f), sampleRate(sr), highPass(sr, 40.0f) {}

  void reset() {
    z1 = 0.0f;
    z2 = 0.0f;
    fbY = 0.0f;
  }

  void processSamples(float *buffer, int len, float cutoffNormFreq,
                      float paramCutoff, float paramPeak) {
    paramPeak *= 0.4f;

    Coefficients coeffs = calculateCoefficients(cutoffNormFreq, paramPeak);

    // Create interpolators for smooth parameter changes
    Interpolator interpCutoff;
    Interpolator interpPeak;
    Interpolator interpB0, interpB1, interpB2, interpA1, interpA2;

    interpCutoff.feed(paramCutoff, len);
    interpPeak.feed(paramPeak, len);
    interpB0.feed(coeffs.b0, len);
    interpB1.feed(coeffs.b1, len);
    interpB2.feed(coeffs.b2, len);
    interpA1.feed(coeffs.a1, len);
    interpA2.feed(coeffs.a2, len);

    for (int i = 0; i < len; i++) {
      float prCutoff = interpCutoff.advance();
      float prPeak = interpPeak.advance();
      float b0 = interpB0.advance();
      float b1 = interpB1.advance();
      float b2 = interpB2.advance();
      float a1 = interpA1.advance();
      float a2 = interpA2.advance();

      // TeeBee-style external feedback with HPF
      float feedbackAmount = prPeak * (1.0f - prCutoff) * 0.9f;
      float feedbackSignal = applySoftClipAt(fbY, 2.0f);
      float feedbackFiltered = highPass.apply(feedbackSignal * feedbackAmount);

      // Direct Form II implementation
      float input = buffer[i] - feedbackFiltered;
      float w = input - a1 * z1 - a2 * z2;
      float y = b0 * w + b1 * z1 + b2 * z2;

      // Update state
      z2 = z1;
      z1 = w;

      // Soft clip
      y = applySoftClipAt(y, 2.0f);
      fbY = y;
      buffer[i] = y;
    }
  }
};

} // namespace dsp
