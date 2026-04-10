import { randF } from "@core/ax-audio/basic/parameters-helper";
import { TwoPi } from "@core/ax-audio/basic/synthesis-helper";

export function fillErrorSound(buffer: Float32Array) {
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = randF() * 0.01;
  }
}

export function debugFillNoise(buffer: Float32Array) {
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = randF() * 0.01;
  }
}

let phase = 0;
export function debugFillSine(
  buffer: Float32Array,
  freq: number,
  sampleRate: number,
) {
  const delta = freq / sampleRate;
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = Math.sin(phase * TwoPi);
    phase = (phase + delta) % 1;
  }
}
