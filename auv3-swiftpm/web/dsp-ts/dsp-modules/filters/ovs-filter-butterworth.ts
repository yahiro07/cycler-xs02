/**
 * Steeper oversampling low-pass filter.
 *
 * Implemented as an Nth-order Butterworth low-pass realized as a cascade of
 * biquad (SOS) sections. This is intended for oversampling interpolation /
 * anti-alias filtering where the simple 1-pole cascade may sound too dull.
 *
 * Notes:
 * - `cutoffScale` is expressed relative to the *original* Nyquist (Fs/2) being 1.0.
 * - Internally we map it to the oversampled domain:
 *     fc_norm_high = cutoffScale / (2 * oversampleRatio)   (0..0.5)
 * - The filter is stateful (keeps z1/z2 per biquad).
 */

import {
  m_cos,
  m_floor,
  m_max,
  m_min,
  m_pi,
  m_sin,
} from "@dsp/utils/math-utils";

type IOvsFilter = {
  reset(): void;
  processSamples(buffer: Float32Array): void;
};

function clamp(v: number, lo: number, hi: number) {
  return m_max(lo, m_min(hi, v));
}

function butterworthQs(order: number): number[] {
  // order must be even (2,4,6,8,...)
  const n = m_max(2, m_floor(order));
  const m = m_floor(n / 2);
  const qs: number[] = [];
  for (let k = 1; k <= m; k++) {
    // Q_k = 1 / (2 cos((2k-1)π / (2n)))
    const ang = ((2 * k - 1) * m_pi) / (2 * n);
    qs.push(1 / (2 * m_cos(ang)));
  }
  return qs;
}

function createBiquadLpCookbook(cutoffNormFreq: number, Q: number) {
  // cutoffNormFreq is normalized to Fs where Nyquist = 0.5
  const f = clamp(cutoffNormFreq, 0.0001, 0.49);
  const q = m_max(0.1, Q);

  const omega = 2.0 * m_pi * f;
  const sinOmega = m_sin(omega);
  const cosOmega = m_cos(omega);
  const alpha = sinOmega / (2.0 * q);

  const a0 = 1.0 + alpha;
  const a1 = -2.0 * cosOmega;
  const a2 = 1.0 - alpha;
  const b0 = (1.0 - cosOmega) / 2.0;
  const b1 = 1.0 - cosOmega;
  const b2 = (1.0 - cosOmega) / 2.0;

  return {
    b0: b0 / a0,
    b1: b1 / a0,
    b2: b2 / a0,
    a1: a1 / a0,
    a2: a2 / a0,
  };
}

export function createOvsFilterButterworth(
  oversampleRatio: number,
  cutoffScale: number,
  order: number = 8,
): IOvsFilter {
  const nx = m_max(1, m_floor(oversampleRatio));
  const ord = m_max(2, m_floor(order / 2) * 2); // force even

  // cutoffScale: original Nyquist (Fs/2) is 1.0
  // so actual cutoff in oversampled normalized domain is:
  // fc_norm_high = (cutoffScale * Fs/2) / (Fs*nx) = cutoffScale / (2*nx)
  const fcNormHigh = clamp(cutoffScale / (2 * nx), 0.0001, 0.49);

  const qs = butterworthQs(ord);
  const sections = qs.map((Q) => createBiquadLpCookbook(fcNormHigh, Q));

  // Direct Form II state per section.
  const z1 = new Array(sections.length).fill(0);
  const z2 = new Array(sections.length).fill(0);

  function processSamples(buffer: Float32Array) {
    for (let i = 0; i < buffer.length; i++) {
      let x = buffer[i];
      for (let s = 0; s < sections.length; s++) {
        const { b0, b1, b2, a1, a2 } = sections[s];
        const w = x - a1 * z1[s] - a2 * z2[s];
        const y = b0 * w + b1 * z1[s] + b2 * z2[s];
        z2[s] = z1[s];
        z1[s] = w;
        x = y;
      }
      buffer[i] = x;
    }
  }

  function reset() {
    z1.fill(0);
    z2.fill(0);
  }

  return { processSamples, reset };
}
