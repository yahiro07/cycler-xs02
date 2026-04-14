import { MoEgWave } from "@dsp/base/parameter-defs";
import { mapExpCurve } from "@dsp/dsp-modules/basic/curves";
import { m_exp, m_floor } from "@dsp/utils/math-utils";
import {
  clampValueZeroOne,
  invPower2,
  mapUnaryFrom,
  mapUnaryTo,
  mapUnaryToInt,
  mixValue,
  power3,
  tunableSigmoid,
} from "@dsp/utils/number-utils";

export function getEgCurve(wave: MoEgWave, pos: number, shape: number): number {
  if (wave === MoEgWave.d) {
    const u = 1 - shape;
    const k = -invPower2(u) * 0.95;
    return 1 - tunableSigmoid(pos, k);
  } else if (wave === MoEgWave.d2) {
    shape = invPower2(shape);
    return m_exp(-50 * pos * power3(1 - shape * 0.85));
  } else if (wave === MoEgWave.ad) {
    const t = pos * 0.125;
    const bp = 0.25 * mapUnaryTo(shape, 0.02, 1);
    const sus = shape;
    if (t < bp) {
      return sus + (1 - sus) * mapExpCurve(1 - t / bp, 6);
    }
    return sus;
  } else if (wave === MoEgWave.bump) {
    const bp = mapUnaryTo(shape, 0.1, 1);
    if (pos < bp) {
      const x = (pos / bp - 0.5) * 2;
      return 1 - x * x;
    }
    return 0;
  } else if (wave === MoEgWave.duty) {
    const bp = mapUnaryTo(shape, 0.1, 0.9);
    if (pos < bp) return 1;
    return 0;
  } else if (wave === MoEgWave.stair) {
    const nStep = mapUnaryToInt(shape, 2, 10);
    const y = 1 - m_floor(pos * nStep) / nStep;
    const low = 1 / nStep;
    const z = mapUnaryFrom(y, low, 1);
    return clampValueZeroOne(z);
  }
  return 0;
}

export function getAmpEgCurvePL(
  pos: number,
  duty: number,
  decay: number,
  stepDuration = 1,
) {
  if (duty < 0.05 && decay === 0) {
    //Prevent silence
    duty = 0.05;
  }
  //Ensure that increasing duty proportionally increases the hold time during a tie
  //(adjustment based on a fixed end time)
  const bpShort = duty * stepDuration;
  const bpLong = stepDuration - (1 - duty);
  const bp = mixValue(bpShort, bpLong, duty);
  if (pos <= bp) {
    return 1;
  } else {
    if (decay === 0) return 0;
    if (duty >= 1) return 1;
    const u = (pos - bp) / (stepDuration - bp);
    return getEgCurve(MoEgWave.d2, u, decay);
  }
}
