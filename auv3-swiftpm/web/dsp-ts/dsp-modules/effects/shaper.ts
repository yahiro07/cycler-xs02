import {
  m_abs,
  m_atan,
  m_floor,
  m_max,
  m_min,
  m_pi,
  m_pow,
  m_round,
  m_sign,
  m_sin,
  m_tanh,
} from "@core/utils/math-utils";
import {
  mapUnaryTo,
  mixValue,
  power2,
  tunableSigmoid,
} from "@core/utils/number-utils";

export function applyShaperCore(
  y: number,
  shaperMode: "foldHalf" | "poly" | "foldFull",
) {
  let level = m_abs(y);
  if (shaperMode === "foldHalf") {
    const k = level % 2;
    if (k < 1) {
      level = k;
    } else {
      level = 2 - k;
    }
  } else if (shaperMode === "poly") {
    if (level < 1) {
    } else {
      const k = ((level % 4) / 2) >>> 0;
      if (k === 0) {
        level = 1 - k;
      } else {
        level = k - 1;
      }
    }
  } else if (shaperMode === "foldFull") {
    if (level <= 1) {
    } else {
      const k = ((level - 1) % 4) + 1;
      if (k < 3) {
        level = 1 - (k - 1);
      } else {
        level = -1 + (k - 3);
      }
    }
  }
  return m_sign(y) * level;
}

function wrapBipolar<T extends unknown[]>(
  fn: (x: number, ...restArgs: T) => number,
) {
  return (_x: number, ...restArgs: T) => {
    const sign = m_sign(_x);
    const x = m_abs(_x);
    const y = fn(x, ...restArgs);
    return sign * y;
  };
}

export const shaperCore = {
  foldSine(x: number) {
    return m_sin(x * m_pi * 0.5);
  },
  foldSineHalf: wrapBipolar((_x) => {
    const sign = m_sign(_x);
    const x = m_abs(_x);
    let y = 0;
    if (x < 1) {
      y = m_sin(x * m_pi * 0.5);
    } else {
      y = 1 - (1 - m_sin(x * m_pi * 0.5) ** 2);
    }
    return sign * y;
  }),
  foldTriangle(x: number) {
    const t = (((x + 1) % 4) + 4) % 4;
    return t < 2 ? t - 1 : 3 - t;
  },
  foldTriangleHalf: wrapBipolar((x) => {
    return m_abs(((x + 1) % 2) - 1);
  }),
  foldSaw: wrapBipolar((x) => {
    let y = x - m_floor(x);
    if (((x >> 0) & 1) === 1) y -= 1;
    return y;
  }),
  foldSawHalf(x: number) {
    const sign = m_sign(x);
    let level = m_abs(x);
    level %= 1;
    return sign * level;
  },
  foldPolyHalf: wrapBipolar((x) => {
    if (x < 1) return x;
    if (0) {
      return (x & 1) === 1 ? 1 : 0;
    } else {
      if (x < 2) return 1;
      return ((x / 2) & 1) === 0 ? 1 : 0;
    }
  }),
  foldBlend(x: number, a: number) {
    const f = shaperCore.foldTriangle(x);
    const s = m_sin(x * m_pi * 2);
    return mixValue(f, s, a);
  },
  foldCharpSine: wrapBipolar((x) => {
    const xa = x < 1 ? x : power2(1 + (x - 1) * 0.5);
    return m_sin(xa * m_pi * 0.5);
  }),
  drive1(x: number, a: number) {
    const k = mapUnaryTo(a, 0, -0.9);
    return tunableSigmoid(x, k);
  },
  drive2(x: number, a: number) {
    if (x < 0) return x;
    const k = mapUnaryTo(a, 0, -0.9);
    return tunableSigmoid(x, k);
  },
  drive3(x: number, a: number) {
    const gain = mapUnaryTo(power2(a), 1, 42);
    const dry = x;
    x = x * gain;
    const wet = x / (1 + m_abs(x));
    return mixValue(dry, wet, a);
  },
  crush(x: number, a: number) {
    const step = mapUnaryTo(a, 32, 1);
    return m_round(x * step) / step;
  },
  hardClip(x: number, a: number) {
    const g = mapUnaryTo(power2(a), 1, 20);
    x *= g;
    return m_max(-1, m_min(1, x));
  },
  softAtan(x: number, a: number) {
    const g = mapUnaryTo(power2(a), 1, 30);
    const k = (2 / m_pi) * m_atan(x * g);
    return k;
  },
  softTanh(x: number, a: number) {
    const g = mapUnaryTo(power2(a), 1, 25);
    const y = m_tanh(x * g);
    return y;
  },
  diode(x: number, a: number) {
    const g = mapUnaryTo(power2(a), 1, 40);
    x *= g;
    const p = m_max(0, x);
    const n = m_min(0, x);
    const y = p / (1 + p) + (n / (1 + m_abs(n))) * 0.4;
    return m_max(-1, m_min(1, y));
  },
  asymClip(x: number, a: number) {
    const g = mapUnaryTo(power2(a), 1, 30);
    x *= g;
    const pos = 0.6;
    const neg = 1.0;
    const y = x >= 0 ? m_min(x, pos) : m_max(x, -neg);
    return y;
  },
  fuzzPow(x: number, a: number) {
    const g = mapUnaryTo(power2(a), 1, 60);
    x *= g;
    const s = m_sign(x);
    const ax = m_min(1, m_abs(x));
    const p = mapUnaryTo(a, 0.7, 0.2);
    return s * m_pow(ax, p);
  },
};
