import {
  applyHardClip,
  applySoftClip,
} from "@dsp/dsp-modules/effects/soft-clip-shaper";
import { m_sqrt } from "@dsp/utils/math-utils";
import { mixValue } from "@dsp/utils/number-utils";

export function readBufferInterpolated(
  buffer: number[] | Float32Array,
  len: number,
  fIndex: number,
): number {
  const idx0 = fIndex >> 0;
  const idx1 = (idx0 + 1) % len;
  const fraction = fIndex - idx0;
  return mixValue(buffer[idx0], buffer[idx1], fraction);
}

export function copyBuffer(
  dstBuffer: Float32Array,
  srcBuffer: Float32Array,
  len: number,
) {
  for (let i = 0; i < len; i++) {
    dstBuffer[i] = srcBuffer[i];
  }
}

export function writeBuffer(
  dstBuffer: Float32Array,
  srcBuffer: Float32Array,
  len: number) {
  for (let i = 0; i < len; i++) {
    dstBuffer[i] += srcBuffer[i];
  }
}

export function writeBufferWithGain(
  dstBuffer: Float32Array,
  srcBuffer: Float32Array,
  len: number,
  volume: number
) {
  for (let i = 0; i < len; i++) {
    dstBuffer[i] += srcBuffer[i] * volume;
  }
}

export function applyBufferGain(
  buffer: Float32Array,
  len: number,
  gain: number,
) {
  for (let i = 0; i < len; i++) {
    buffer[i] *= gain;
  }
}

export function applyBufferGainRms(
  buffer: Float32Array,
  len: number,
  numSources: number,
) {
  const gain = 1 / m_sqrt(numSources);
  applyBufferGain(buffer, len, gain);
}

export function applyBufferGainB(
  buffer: Float32Array,
  len: number,
  gains: Float32Array,
) {
  for (let i = 0; i < len; i++) {
    buffer[i] *= gains[i];
  }
}

export function applyBufferSoftClip(buffer: Float32Array, len: number) {
  for (let i = 0; i < len; i++) {
    buffer[i] = applySoftClip(buffer[i]);
  }
}

export function applyBufferHardClip(buffer: Float32Array, len: number) {
  for (let i = 0; i < len; i++) {
    buffer[i] = applyHardClip(buffer[i]);
  }
}
