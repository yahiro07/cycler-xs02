import { LfoWave } from "@core/base/parameter_defs";

export function getLfoWave(wave: LfoWave, x: number) {
  if (wave === LfoWave.sine) {
    return Math.sin(x * Math.PI * 2);
  }
  if (wave === LfoWave.rect) {
    return x < 0.5 ? 1 : 0;
  }
  if (wave === LfoWave.tri) {
    return x < 0.5 ? 2 * x : 2 * (1 - x);
  }
  if (wave === LfoWave.saw) {
    return 1 - x;
  }
  return 0;
}
