export const uiSizes = {
  knobMain: 88,
  knobSmall: 78,
  knobXs: 74,
  waveDisplay: 36,
};

const unitSizeToAsrMap = {
  u11: 1.05,
  u15: 1.55,
  u18: 1.8,
  u20: 2,
} satisfies Record<string, number>;

export type UnitSizeSpec = keyof typeof unitSizeToAsrMap | number;

export function unitSizeToAsr(unitSize: UnitSizeSpec = "u18") {
  if (typeof unitSize === "number") {
    return unitSize;
  }
  return unitSizeToAsrMap[unitSize];
}

export const knobRingConfigs = {
  ringThickness: 8,
  radius: uiSizes.knobMain / 2 + 8 - 1,
};
