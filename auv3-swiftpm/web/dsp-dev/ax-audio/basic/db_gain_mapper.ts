import { linearInterpolate } from "@core/ax/number_utils";

export function mapDbGain(
  level: number,
  gainConfig: {
    levelCenter: number;
    dbLo: number;
    dbHi: number;
  },
) {
  const { levelCenter, dbLo, dbHi } = gainConfig;
  const cp = levelCenter;
  let db = 1;
  if (level < 0.001) return 0;
  if (level < cp) {
    db = linearInterpolate(level, cp, 0, 0, dbLo);
  } else {
    db = linearInterpolate(level, cp, 1, 0, dbHi);
  }
  return Math.pow(10, db / 20);
}
