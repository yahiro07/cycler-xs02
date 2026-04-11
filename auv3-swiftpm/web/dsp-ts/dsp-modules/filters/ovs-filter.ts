import { m_exp, m_pi } from "@core/utils/math-utils";

export function createOvsFilterSimple(
  oversampleRatio: number,
  //cutoffScale: The ratio of the cutoff frequency when the original sampling rate Fs/2 is set to 1.0
  //Set to 1 if no special adjustment to the timbre is required
  cutoffScale: number,
) {
  const alpha = 1 - m_exp((-m_pi * cutoffScale) / oversampleRatio);
  let y1 = 0;
  let y2 = 0;
  let y3 = 0;

  function processSamples(buffer: Float32Array) {
    for (let i = 0; i < buffer.length; i++) {
      const x = buffer[i];
      y1 = (1 - alpha) * y1 + alpha * x;
      y2 = (1 - alpha) * y2 + alpha * y1;
      y3 = (1 - alpha) * y3 + alpha * y2;
      buffer[i] = y3;
    }
  }
  function reset() {
    y1 = 0;
    y2 = 0;
    y3 = 0;
  }
  return { processSamples, reset };
}
