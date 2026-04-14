import { seqNumbers } from "@dsp/utils/arrays";
import { m_floor, m_imul, m_random } from "@dsp/utils/math-utils";

const randomSequence = seqNumbers(1000).map(() => m_random());

export function deterministicRandom(seed: number) {
  const s = m_floor(seed * 65536) >>> 0;
  let x = m_imul(s ^ 0x9e3779b9, 0x26535761) >>> 0;
  x = (x ^ (x >>> 16)) >>> 0;
  const pos = x % randomSequence.length;
  return randomSequence[pos];
}
