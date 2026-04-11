import { seqNumbers } from "@core/utils/arrays";
import { m_cos, m_pi, m_sin } from "@core/utils/math-utils";
import { mixValue } from "@core/utils/number-utils";

function createAllPassFilter() {
  let in1 = 0;
  let in2 = 0;
  let out1 = 0;
  let out2 = 0;

  return {
    processSample(_in: number, normFreq: number, q: number) {
      const omega = 2 * m_pi * normFreq;
      const alpha = m_sin(omega) / (2 * q);
      const a0 = 1 + alpha;
      const a1 = -2 * m_cos(omega);
      const a2 = 1 - alpha;
      const b0 = 1 - alpha;
      const b1 = -2 * m_cos(omega);
      const b2 = 1 + alpha;

      const out =
        (b0 / a0) * _in +
        (b1 / a0) * in1 +
        (b2 / a0) * in2 -
        (a1 / a0) * out1 -
        (a2 / a0) * out2;
      in2 = in1;
      in1 = _in;
      out2 = out1;
      out1 = out;
      return out;
    },
  };
}

export type PhaserAllPass4 = {
  processSamples(buffer: Float32Array, normFreq: number, prMix: number): void;
};

export function createPhaser(): PhaserAllPass4 {
  const allPasses = seqNumbers(4).map(createAllPassFilter);

  return {
    processSamples(buffer: Float32Array, normFreq: number, prMix: number) {
      for (let i = 0; i < buffer.length; i++) {
        const input = buffer[i];
        const dry = input;
        let y = input;
        for (let i = 0; i < allPasses.length; i++) {
          const ap = allPasses[i];
          y = ap.processSample(y, normFreq, 1);
        }
        const wet = y;
        buffer[i] = mixValue(dry, wet, prMix);
      }
    },
  };
}
export const createPhaserAllPass4 = createPhaser;
