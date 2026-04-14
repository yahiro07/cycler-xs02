import { m_pow } from "@dsp/utils/math-utils";

export function midiToFrequency(midiNote: number): number {
  return 440 * m_pow(2, (midiNote - 69) / 12);
}
