import { raiseInvalidCondition } from "@core/ax/errors";
import { roundFloat } from "@core/ax/number_utils";

export function shiftArrayItemNext<T>(items: T[], item: T): T {
  const index = items.indexOf(item);
  const nextIndex = index === -1 ? 0 : (index + 1) % items.length;
  return items[nextIndex];
}

export function randF() {
  return Math.random();
}

export function randNP() {
  return Math.random() * 2 - 1;
}

export function randFR(lo: number, hi: number) {
  return Math.random() * (hi - lo) + lo;
}

export function randB(onWeight: number = 0.5) {
  return Math.random() < onWeight;
}

export function randChoice<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function randChoiceWeighted<K extends string>(
  items: Record<K, number>,
): K {
  const keys = Object.keys(items) as K[];
  const values = Object.values(items) as number[];
  if (values.some((v) => !(Number.isFinite(v) && v >= 0))) {
    raiseInvalidCondition();
  }
  const totalWeight = values.reduce((acc, curr) => acc + curr, 0);
  if (totalWeight <= 0) {
    raiseInvalidCondition();
  }
  const randomValue = Math.random() * totalWeight;
  let cumulative = 0;
  for (let i = 0; i < values.length; i++) {
    cumulative += values[i];
    if (randomValue <= cumulative) {
      return keys[i];
    }
  }
  return keys[keys.length - 1];
}

export function randChoiceWeightedI<K extends number>(
  items: Record<K, number>,
): K {
  const keys = Object.keys(items).map(Number) as K[];
  const values = Object.values(items) as number[];
  if (values.some((v) => !(Number.isFinite(v) && v >= 0))) {
    raiseInvalidCondition();
  }
  const totalWeight = values.reduce((acc, curr) => acc + curr, 0);
  if (totalWeight <= 0) {
    raiseInvalidCondition();
  }
  const randomValue = Math.random() * totalWeight;
  let cumulative = 0;
  for (let i = 0; i < values.length; i++) {
    cumulative += values[i];
    if (randomValue <= cumulative) {
      return keys[i];
    }
  }
  return keys[keys.length - 1];
}

export function fisherYatesShuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function patchArrayItem<T>(array: T[], index: number, value: T) {
  return array.map((item, i) => (i === index ? value : item));
}

export function roundFloatFields<T extends object>(
  params: T,
  fracDigits: number,
): T {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "number" && value % 1 !== 0) {
        value = roundFloat(value, fracDigits);
      }
      return [key, value];
    }),
  ) as T;
}
