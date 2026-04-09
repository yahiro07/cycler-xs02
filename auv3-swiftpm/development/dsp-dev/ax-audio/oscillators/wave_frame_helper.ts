import { clampValue, mixValue } from "@core/ax/number_utils";

export function calculateWaveFrameSize(numHarmonics: number) {
  const n = Math.pow(2, Math.ceil(Math.log2(numHarmonics)));
  return clampValue(n * 8, 64, 2048);
}

export function readWaveFrameInterpolated(
  buffer: Float32Array,
  pp: number,
): number {
  pp = pp - Math.floor(pp);
  const fIndex = pp * buffer.length;
  const idx0 = fIndex >> 0;
  const idx1 = (idx0 + 1) % buffer.length;
  const frac = fIndex - idx0;
  return mixValue(buffer[idx0], buffer[idx1], frac);
}
