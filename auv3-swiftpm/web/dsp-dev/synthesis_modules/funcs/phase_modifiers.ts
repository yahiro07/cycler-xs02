import { seqNumbers } from "@core/ax/arrays";
import {
  clampValueZeroOne,
  fracPart,
  invPower2,
  mapUnaryTo,
  mixValue,
  power2,
} from "@core/ax/number_utils";
import { HalfPi, Pi, TwoPi } from "@core/ax-audio/basic/synthesis_helper";
import { OscColorMode } from "@core/base/parameter_defs";

const randomSequence = seqNumbers(200).map(() => Math.random());

export function modifyPhaseWithColor(
  phase: number,
  prColor: number,
  colorMode: OscColorMode,
) {
  switch (colorMode) {
    case OscColorMode.sfm: {
      const fmRatio = mapUnaryTo(prColor, 1, 4);
      const fmDepth = prColor * 2;
      const fmOscValue = Math.sin(phase * TwoPi * fmRatio);
      const modPhase = fracPart(phase + fmOscValue * fmDepth);
      const maxSlope = 1 + TwoPi * fmDepth * fmRatio;
      return [modPhase, maxSlope];
    }
    case OscColorMode.speed: {
      const speedRate = 1 + prColor * 7;
      const modPhase = (phase * speedRate) % 1;
      return [modPhase, speedRate];
    }
    case OscColorMode.accel: {
      const speedRate = 1 + power2(phase) * prColor * 15;
      const modPhase = (phase * speedRate) % 1;
      return [modPhase, speedRate];
    }
    case OscColorMode.drill: {
      const [_x, _a] = [phase, prColor];
      const a = mapUnaryTo(_a, 0.25, 1);
      const x = _x;
      const speedRate = 1 + power2(a) * 15;
      const x1Raw = x * speedRate;
      const x1 = x1Raw % 1;
      let y1 = x1 < 0.5 ? 0 : 1;
      if (x1Raw < 2) y1 = 1;
      const modPhase = x * y1;
      return [modPhase, 1];
    }
    case OscColorMode.sdm: {
      const speedRate = mapUnaryTo(prColor, 1, 100);
      const indexF = phase * speedRate;
      const i0 = Math.floor(indexF);
      const i1 = i0 + 1;
      const m = indexF - i0;
      const y1 = phase;
      const y2 = mixValue(
        i0 === 0 ? 0 : randomSequence[i0],
        randomSequence[i1],
        m,
      );
      const y3 = mixValue(y1, y2, prColor);
      const modPhase = mixValue(y1, y3, prColor);
      return [modPhase, speedRate];
    }
    case OscColorMode.creep: {
      const speedRate = 1 + prColor * 31;
      const gainRight = mapUnaryTo(prColor, 1, 0);
      const y = -Math.cos(invPower2(phase) * Pi * speedRate) * 0.5 + 0.5;
      const gain = mapUnaryTo(phase, 1, gainRight);
      const gain2 = mapUnaryTo(invPower2(prColor), 1, 1.07);
      const modPhase = clampValueZeroOne(y * gain * gain2);
      return [modPhase, speedRate];
    }
    case OscColorMode.sinus: {
      const modPhase = -Math.cos(phase * Pi * (1 + prColor * 15)) * 0.5 + 0.5;
      const maxSlope = HalfPi * (1 + prColor * 15);
      return [modPhase, maxSlope];
    }
    case OscColorMode.ridge: {
      const speedRate = 1 + prColor * 15;
      const modPhase = Math.abs(Math.sin(phase * HalfPi * speedRate));
      return [modPhase, speedRate];
    }
  }
  return [phase, 1];
}
