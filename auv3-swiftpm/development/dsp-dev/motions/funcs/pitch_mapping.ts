import {
  clampValue,
  mapUnaryTo,
  mapUnaryToInt,
  mapUnaryToValues,
} from "@core/ax/number_utils";
import { OscPitchMode } from "@core/base/parameter_defs";

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

export function mapParamOscPitchToRelativeNote(
  prPitch: number,
  pitchMode: OscPitchMode,
) {
  if (pitchMode === OscPitchMode.octave) {
    return mapUnaryToInt(prPitch, -2, 2) * 12;
  } else if (pitchMode === OscPitchMode.oct_x) {
    return Math.floor(mapUnaryTo(prPitch, -2, 2)) * 12;
  } else if (pitchMode === OscPitchMode.semi) {
    const d = 6;
    return mapUnaryToInt(prPitch, -d, d);
  } else if (pitchMode === OscPitchMode.linear) {
    const d = 2;
    return mapUnaryTo(prPitch, -12 * d, 12 * d);
  } else if (pitchMode === OscPitchMode.ratio) {
    let ratio = 1;
    if (prPitch > 0.5) {
      const pos = (prPitch - 0.5) * 2;
      ratio = mapUnaryToInt(pos, 1, 8);
    } else {
      const pos = (0.5 - prPitch) * 2;
      ratio = mapUnaryToValues(pos, [1, 1 / 2, 1 / 3, 1 / 4]);
    }
    return 12 * Math.log2(ratio);
  } else if (pitchMode === OscPitchMode.map1) {
    return mapUnaryToValues(prPitch, noteMapperConstants.map1Notes);
  } else if (pitchMode === OscPitchMode.map2) {
    return mapUnaryToValues(prPitch, noteMapperConstants.map2Notes);
  } else if (pitchMode === OscPitchMode.map3) {
    return mapUnaryToValues(prPitch, noteMapperConstants.map3Notes);
  }
  return 0;
}

//0~4で連続
export function mapParamOscPitchToOctXCrossMixRateKey(prPitch: number) {
  const octave = mapUnaryTo(prPitch, -2, 2);
  return clampValue(octave + 2, 0, 4);
}

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

export function getPitchModeTickStep(pitchMode: OscPitchMode) {
  return pitchModeTickStepMap[pitchMode];
}
