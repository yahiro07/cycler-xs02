import { m_random, m_sin, m_two_pi } from "@dsp/utils/math-utils";

export function fillErrorSound(buffer: Float32Array, len: number) {
  for (let i = 0; i < len; i++) {
    buffer[i] = m_random() * 0.01;
  }
}

export function debugFillNoise(buffer: Float32Array, len: number) {
  for (let i = 0; i < len; i++) {
    buffer[i] = m_random() * 0.01;
  }
}

let phase = 0;
export function debugFillSine(
  buffer: Float32Array,
  len: number,
  freq: number,
  sampleRate: number,
) {
  const delta = freq / sampleRate;
  for (let i = 0; i < len; i++) {
    buffer[i] = m_sin(phase * m_two_pi);
    phase = (phase + delta) % 1;
  }
}
