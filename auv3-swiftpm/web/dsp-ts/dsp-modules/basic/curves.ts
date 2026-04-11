import { m_abs, m_cos, m_pi, m_sign, m_sin } from "@core/utils/math-utils";
import { invPower2 } from "@core/utils/number-utils";

export const curveMapper = {
  riseSine(x: number) {
    return m_sin(x * m_pi * 0.5);
  },
  fallSine(x: number) {
    return 1 - m_sin(x * m_pi * 0.5);
  },
  riseInvCosine(x: number) {
    return 0.5 - 0.5 * m_cos(x * m_pi);
  },
  riseInvCosineTight(x: number) {
    let y = m_cos(x * m_pi);
    y = invPower2(m_abs(y)) * m_sign(y);
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
