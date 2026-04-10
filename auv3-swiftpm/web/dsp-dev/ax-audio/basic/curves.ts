import { invPower2 } from "@core/ax/number_utils";

export const curveMapper = {
  riseSine(x: number) {
    return Math.sin(x * Math.PI * 0.5);
  },
  fallSine(x: number) {
    return 1 - Math.sin(x * Math.PI * 0.5);
  },
  riseInvCosine(x: number) {
    return 0.5 - 0.5 * Math.cos(x * Math.PI);
  },
  riseInvCosineTight(x: number) {
    let y = Math.cos(x * Math.PI);
    y = invPower2(Math.abs(y)) * Math.sign(y);
    return 0.5 - 0.5 * y;
  },
};

export const glideCurves = {
  glide1(pp: number, a: number, tight = false) {
    if (pp < a) {
      const fn = tight
        ? curveMapper.riseInvCosineTight
        : curveMapper.riseInvCosine;
      return fn(pp / a);
    } else {
      return 1;
    }
  },
  glide2(pp: number, a: number) {
    if (pp < a) {
      return invPower2(pp / a);
    } else {
      return 1;
    }
  },
  glide3(pp: number, a: number) {
    if (pp < a) {
      return mapInvExpCurve(pp / a);
    } else {
      return 1;
    }
  },
};

export function mapExpCurve(x: number, scaler: number = 4) {
  return (2 ** (x * scaler) - 1) / (2 ** scaler - 1);
}

export function mapInvExpCurve(x: number, scaler: number = 4) {
  return 1 - mapExpCurve(1 - x, scaler);
}
