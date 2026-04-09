export const Pi = Math.PI;
export const TwoPi = Math.PI * 2;
export const HalfPi = Math.PI * 0.5;

export function midiToFrequency(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}
