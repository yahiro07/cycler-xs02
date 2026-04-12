import { MoId } from "@dsp/base/parameter-defs";
import { Bus } from "@dsp/base/synthesis-bus";

export enum RandomValueStateFlag {
  rndActive = 1,
  rndSkip = 2,
  rndOff = 3,
}

export type RandomValueMapperFn = (
  bus: Bus,
  rr: number,
  stateFlag: RandomValueStateFlag,
) => number;

export type MotionPartValues = {
  rndOut: number; //0~1
  rndMappedValue: number;
  egLevel: number; //0~1
  lfoOut: number; //0~1
  lfoDepth: number; //0~1
  envMod: number; //0~1
  rndRange: number; //0~1
  lfoOnGain: number;
  rndOnGain: number;
  egOnGain: number;
};

export const moIdSeeds: Record<MoId, number> = {
  [MoId.oscPitch]: 110,
  [MoId.oscColor]: 120,
  [MoId.filterCutoff]: 130,
  [MoId.shaperLevel]: 140,
  [MoId.delayTime]: 150,
  [MoId.phaserLevel]: 160,
};
