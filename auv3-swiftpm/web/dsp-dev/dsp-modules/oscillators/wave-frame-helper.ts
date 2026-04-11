import { m_ceil, m_floor, m_log2, m_pow } from "@core/utils/math-utils";
import { clampValue, mixValue } from "@core/utils/number-utils";

export function calculateWaveFrameSize(numHarmonics: number) {
  const n = m_pow(2, m_ceil(m_log2(numHarmonics)));
  return clampValue(n * 8, 64, 2048);
}

export function readWaveFrameInterpolated(
  buffer: Float32Array,
  pp: number,
): number {
  pp = pp - m_floor(pp);
  const fIndex = pp * buffer.length;
  const idx0 = fIndex >> 0;
  const idx1 = (idx0 + 1) % buffer.length;
  const frac = fIndex - idx0;
  return mixValue(buffer[idx0], buffer[idx1], frac);
}
