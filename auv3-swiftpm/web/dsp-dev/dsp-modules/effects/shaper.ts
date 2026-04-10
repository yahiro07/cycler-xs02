import { HalfPi } from "@core/dsp-modules/basic/synthesis-helper";
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
  let level = Math.abs(y);
  if (shaperMode === "foldHalf") {
    //fold half
    const k = level % 2;
    if (k < 1) {
      level = k;
    } else {
      level = 2 - k;
    }
  } else if (shaperMode === "poly") {
    //poly
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
    //fold full
    if (level <= 1) {
    } else {
      const k = ((level - 1) % 4) + 1;
      if (k < 3) {
        level = 1 - (k - 1);
      } else {
        level = -1 + (k - 3);
      }
      // level = mapCurved(Math.abs(level), "invCosineH") * Math.sign(level);
    }
  }
  return Math.sign(y) * level;
}

function wrapBipolar<T extends unknown[]>(
  fn: (x: number, ...restArgs: T) => number,
) {
  return (_x: number, ...restArgs: T) => {
    const sign = Math.sign(_x);
    const x = Math.abs(_x);
    const y = fn(x, ...restArgs);
    return sign * y;
  };
}

export const shaperCore = {
  foldSine(x: number) {
    return Math.sin(x * Math.PI * 0.5);
  },
  foldSineHalf: wrapBipolar((_x) => {
    const sign = Math.sign(_x);
    const x = Math.abs(_x);
    let y = 0;
    if (x < 1) {
      y = Math.sin(x * HalfPi);
    } else {
      y = 1 - (1 - Math.sin(x * HalfPi) ** 2);
    }
    return sign * y;
  }),
  foldTriangle(x: number) {
    const t = (((x + 1) % 4) + 4) % 4;
    return t < 2 ? t - 1 : 3 - t;
  },
  foldTriangleHalf: wrapBipolar((x) => {
    return Math.abs(((x + 1) % 2) - 1);
  }),
  foldSaw: wrapBipolar((x) => {
    let y = x - Math.floor(x);
    if (((x >> 0) & 1) === 1) y -= 1;
    return y;
  }),
  foldSawHalf(x: number) {
    const sign = Math.sign(x);
    let level = Math.abs(x);
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
    const s = Math.sin(x * Math.PI * 2);
    return mixValue(f, s, a);
  },
  foldCharpSine: wrapBipolar((x) => {
    const xa = x < 1 ? x : power2(1 + (x - 1) * 0.5);
    return Math.sin(xa * Math.PI * 0.5);
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
    const wet = x / (1 + Math.abs(x));
    return mixValue(dry, wet, a);
  },
  crush(x: number, a: number) {
    const step = mapUnaryTo(a, 32, 1);
    return Math.round(x * step) / step;
  },
  // 1) hard clip（最も基本）
  hardClip(x: number, a: number) {
    const g = mapUnaryTo(power2(a), 1, 20);
    x *= g;
    return Math.max(-1, Math.min(1, x));
  },

  // 2) soft clip (atan) オーバードライブっぽい
  softAtan(x: number, a: number) {
    const g = mapUnaryTo(power2(a), 1, 30);
    const k = (2 / Math.PI) * Math.atan(x * g);
    return k;
  },

  // 3) tanh 系（滑らか、音量も扱いやすい）
  softTanh(x: number, a: number) {
    const g = mapUnaryTo(power2(a), 1, 25);
    // tanh近似: x/(1+|x|) よりもう少し柔らかくしたければこれ
    const y = Math.tanh(x * g);
    return y;
  },

  // 4) diode-ish（片側が潰れやすい。倍音が増えやすい）
  diode(x: number, a: number) {
    const g = mapUnaryTo(power2(a), 1, 40);
    x *= g;
    const p = Math.max(0, x);
    const n = Math.min(0, x);
    const y = p / (1 + p) + (n / (1 + Math.abs(n))) * 0.4;
    return Math.max(-1, Math.min(1, y));
  },

  // 5) asym clip（偶数次が増えてファズ寄り）
  asymClip(x: number, a: number) {
    const g = mapUnaryTo(power2(a), 1, 30);
    x *= g;
    const pos = 0.6; // 正側だけ先に頭打ち
    const neg = 1.0;
    const y = x >= 0 ? Math.min(x, pos) : Math.max(x, -neg);
    return y;
  },

  // 6) fuzz (power)（強め。音量補正込み）
  fuzzPow(x: number, a: number) {
    const g = mapUnaryTo(power2(a), 1, 60);
    x *= g;
    const s = Math.sign(x);
    const ax = Math.min(1, Math.abs(x));
    // aが上がるほど角が立つ
    const p = mapUnaryTo(a, 0.7, 0.2);
    return s * Math.pow(ax, p);
  },
};
