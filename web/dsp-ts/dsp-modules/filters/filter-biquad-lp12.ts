// Biquad Lowpass Filter (12dB/oct, 2-pole)
// Standard cookbook implementation

import { createInterpolator } from "@dsp/dsp-modules/basic/interpolator";
import { applySoftClipAt } from "@dsp/dsp-modules/effects/soft-clip-shaper";
import { createFilterOnePoleHighPass } from "@dsp/dsp-modules/filters/filter-onepole-highpass";
import { m_cos, m_sin, m_two_pi } from "@dsp/utils/math-utils";
import { clampValue } from "@dsp/utils/number-utils";

export interface IFilter {
  reset(): void;
  processSamples(
    buffer: Float32Array,
    len: number,
    cutoffNormFreq: number, // 0__0.5
    paramCutoff: number,
    paramPeak: number, // 0__1
  ): void;
}

export function createFilterBiquadLp12(sampleRate: number): IFilter {
  // Biquad state variables (Direct Form II)
  let z1 = 0;
  let z2 = 0;

  // External feedback state (one-sample delay).
  // Used for TeeBee-style stabilization with HPF in the feedback path.
  let fbY = 0;

  type Coefficients = {
    b0: number;
    b1: number;
    b2: number;
    a1: number;
    a2: number;
  };

  const interpolators = {
    paramCutoff: createInterpolator(),
    paramPeak: createInterpolator(),
    b0: createInterpolator(),
    b1: createInterpolator(),
    b2: createInterpolator(),
    a1: createInterpolator(),
    a2: createInterpolator(),
  };

  // Feedback-path HPF to prevent DC / very-low-frequency buildup.
  const highPass = createFilterOnePoleHighPass(sampleRate, 40);

  function calculateCoefficients(
    cutoffNormFreq: number,
    paramPeak: number,
  ): Coefficients {
    // Ensure cutoffNormFreq is in valid range
    const freq = clampValue(cutoffNormFreq, 0.0001, 0.49);

    // Map paramResonance (0-1) to Q (0.5-20)
    // Q = 0.5 means no resonance, higher Q means more resonance
    const minQ = 0.5;
    const maxQ = 20.0;
    const Q = minQ + paramPeak * (maxQ - minQ);

    // Cookbook formula for lowpass biquad
    const omega = m_two_pi * freq;
    const sinOmega = m_sin(omega);
    const cosOmega = m_cos(omega);
    const alpha = sinOmega / (2.0 * Q);

    const a0 = 1.0 + alpha;
    const a1 = -2.0 * cosOmega;
    const a2 = 1.0 - alpha;
    const b0 = (1.0 - cosOmega) / 2.0;
    const b1 = 1.0 - cosOmega;
    const b2 = (1.0 - cosOmega) / 2.0;

    // Normalize by a0
    return {
      b0: b0 / a0,
      b1: b1 / a0,
      b2: b2 / a0,
      a1: a1 / a0,
      a2: a2 / a0,
    };
  }

  function processSamples(
    buffer: Float32Array,
    len: number,
    cutoffNormFreq: number,
    paramCutoff: number,
    paramPeak: number,
  ): void {
    paramPeak *= 0.4;

    const coeffs = calculateCoefficients(cutoffNormFreq, paramPeak);
    interpolators.paramCutoff.feed(paramCutoff, len);
    interpolators.paramPeak.feed(paramPeak, len);
    interpolators.b0.feed(coeffs.b0, len);
    interpolators.b1.feed(coeffs.b1, len);
    interpolators.b2.feed(coeffs.b2, len);
    interpolators.a1.feed(coeffs.a1, len);
    interpolators.a2.feed(coeffs.a2, len);

    for (let i = 0; i < len; i++) {
      const prCutoff = interpolators.paramCutoff.advance();
      const prPeak = interpolators.paramPeak.advance();
      const b0 = interpolators.b0.advance();
      const b1 = interpolators.b1.advance();
      const b2 = interpolators.b2.advance();
      const a1 = interpolators.a1.advance();
      const a2 = interpolators.a2.advance();

      // TeeBee-style external feedback with HPF (one-sample delay).
      // This is intentionally *outside* the cookbook biquad topology.
      const feedbackAmount = prPeak * (1 - prCutoff) * 0.9;

      const feedbackSignal = applySoftClipAt(fbY, 2);
      const feedbackFiltered = highPass.apply(feedbackSignal * feedbackAmount);

      // Direct Form II implementation
      const input = buffer[i] - feedbackFiltered;
      const w = input - a1 * z1 - a2 * z2;
      let y = b0 * w + b1 * z1 + b2 * z2;

      // Update state
      z2 = z1;
      z1 = w;

      //soft clip
      y = applySoftClipAt(y, 2);
      fbY = y;
      buffer[i] = y;
    }
  }

  function reset() {
    z1 = 0;
    z2 = 0;
    fbY = 0;
  }

  return { processSamples, reset };
}
