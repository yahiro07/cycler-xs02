import {
  applyHardClip,
  applySoftClip,
} from "@core/dsp-modules/effects/soft-clip-shaper";
import { m_sqrt } from "@core/utils/math-utils";
import { mixValue } from "@core/utils/number-utils";

export function readBufferInterpolated(
  buffer: number[] | Float32Array,
  fIndex: number,
): number {
  const sz = buffer.length;
  const idx0 = fIndex >> 0;
  const idx1 = (idx0 + 1) % sz;
  const fraction = fIndex - idx0;
  return mixValue(buffer[idx0], buffer[idx1], fraction);
}

export function copyBuffer(dstBuffer: Float32Array, srcBuffer: Float32Array) {
  for (let i = 0; i < dstBuffer.length; i++) {
    dstBuffer[i] = srcBuffer[i];
  }
}

export function writeBuffer(
  dstBuffer: Float32Array,
  srcBuffer: Float32Array,
  volume: number = 1,
) {
  for (let i = 0; i < dstBuffer.length; i++) {
    dstBuffer[i] += srcBuffer[i] * volume;
  }
}

export function applyBufferGain(buffer: Float32Array, gain: number) {
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] *= gain;
  }
}

export function applyBufferGainRms(buffer: Float32Array, numSources: number) {
  const gain = 1 / m_sqrt(numSources);
  applyBufferGain(buffer, gain);
}

export function applyBufferGainB(buffer: Float32Array, gains: Float32Array) {
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] *= gains[i];
  }
}

export function applyBufferSoftClip(buffer: Float32Array) {
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = applySoftClip(buffer[i]);
  }
}

export function applyBufferHardClip(buffer: Float32Array) {
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = applyHardClip(buffer[i]);
  }
}
