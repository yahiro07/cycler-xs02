import { m_abs, m_sign, m_sqrt2 } from "@dsp/utils/math-utils";
import {
  clampValue,
  invPower2,
  invPower4,
  linearInterpolate,
  mapUnaryTo,
} from "@dsp/utils/number-utils";

export const softClipShapers = {
  soft1(_x) {
    const sign = m_sign(_x);
    let x = m_abs(_x);
    const ta = 0.8;
    const tb = 1.25;
    if (x < ta) {
    } else if (x < tb) {
      const u = linearInterpolate(x, ta, tb, 0, 1);
      x = mapUnaryTo(invPower2(u), ta, 1);
    } else {
      x = 1;
    }
    return clampValue(sign * x, -1, 1);
  },
  soft2(_x) {
    const sign = m_sign(_x);
    let x = m_abs(_x);
    const ta = 0.8;
    const tb = 1.8;
    if (x < ta) {
    } else if (x < tb) {
      const u = linearInterpolate(x, ta, tb, 0, 1);
      x = mapUnaryTo(invPower4(u), ta, 1);
    } else {
      x = 1;
    }
    return clampValue(sign * x, -1, 1);
  },
  soft3(x) {
    const sqrt2 = m_sqrt2;
    x = clampValue(x, -sqrt2, sqrt2);
    return x - (x * x * x) / 6.0;
  },
} satisfies Record<string, (x: number) => number>;

//Hard (linear/angular) <-- hard, soft1, soft2, soft3 --> Soft (curved)
type SoftClipType = keyof typeof softClipShapers;

export function applyHardClip(x: number, a?: number) {
  if (a) {
    return clampValue(x, -a, a);
  } else {
    return clampValue(x, -1, 1);
  }
}

export function applySoftClip(_x: number, type: SoftClipType = "soft3") {
  return softClipShapers[type](_x);
}

export function softClip(x: number) {
  return softClipShapers.soft3(x);
}

export function applySoftClipAt(
  _x: number,
  a: number,
  type: SoftClipType = "soft3",
) {
  return softClipShapers[type](_x / a) * a;
}
