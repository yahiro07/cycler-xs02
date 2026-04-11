import { LfoWave } from "@core/base/parameter-defs";
import { m_pi, m_sin } from "@core/utils/math-utils";

export function getLfoWave(wave: LfoWave, x: number) {
  if (wave === LfoWave.sine) {
    return m_sin(x * m_pi * 2);
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
