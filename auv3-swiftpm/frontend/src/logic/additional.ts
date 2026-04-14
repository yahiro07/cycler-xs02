import { OscPitchMode } from "@/base/parameters";
import { mapUnaryToInt } from "@/logic/number-helper";

export function getLfoStepPeriodDisplay(
  lfoRate: number,
  lfoRateStepped: boolean,
): string | undefined {
  if (lfoRateStepped) {
    const k = mapUnaryToInt(1 - lfoRate, 0, 6);
    return {
      0: "/16",
      1: "/8",
      2: "/4",
      3: "/2",
      4: "1",
      5: "2",
      6: "4",
    }[k];
  }
  return undefined;
}

const dn = -12;
const noteMapperConstants = {
  //ラドミラ
  map1Notes: [dn, dn + 3, dn + 7, 0, 3, 7, 12],
  //ラシドレミファソラ
  map2Notes: [
    dn + 0,
    dn + 2,
    dn + 3,
    dn + 5,
    dn + 7,
    dn + 8,
    dn + 10,
    0,
    2,
    3,
    5,
    7,
    8,
    10,
    12,
  ],
  //ラシbド#レミファソラ, ゴアトランス風?
  map3Notes: [
    dn,
    dn + 1,
    dn + 4,
    dn + 5,
    dn + 7,
    dn + 10,
    0,
    1,
    4,
    5,
    7,
    10,
    12,
  ],
  //ラドレミソ, 和風
  map4Notes: [dn, dn + 3, dn + 5, dn + 7, dn + 10, 0, 3, 5, 7, 10, 12],
};

export const pitchModeTickStepMap: Record<
  OscPitchMode,
  number | [number, number] | undefined
> = {
  [OscPitchMode.linear]: undefined,
  [OscPitchMode.octave]: 4,
  [OscPitchMode.oct_x]: undefined,
  [OscPitchMode.ratio]: [3, 7],
  [OscPitchMode.semi]: 12,
  [OscPitchMode.map1]: noteMapperConstants.map1Notes.length - 1,
  [OscPitchMode.map2]: noteMapperConstants.map2Notes.length - 1,
  [OscPitchMode.map3]: noteMapperConstants.map3Notes.length - 1,
};
