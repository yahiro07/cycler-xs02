import { MoId, MoType, MotionParams } from "@dsp/base/parameter-defs";
import { Bus } from "@dsp/base/synthesis-bus";
import {
  MotionPartValues,
  moIdSeeds,
  RandomValueMapperFn,
} from "@dsp/motions/impl/motion-common";
import * as motion_mapping_core_internal from "@dsp/motions/impl/motion-curve-mapper";

function getMotionParamsAndSeed(
  bus: Bus,
  moId: MoId,
): { mp: MotionParams; moIdSeed: number } {
  const moKey = (
    {
      [MoId.oscPitch]: "moOscPitch",
      [MoId.oscColor]: "moOscColor",
      [MoId.filterCutoff]: "moFilterCutoff",
      [MoId.shaperLevel]: "moShaperLevel",
      [MoId.delayTime]: "moDelayTime",
      [MoId.phaserLevel]: "moPhaserLevel",
    } as const
  )[moId];
  const mp = bus.sp[moKey];
  const moIdSeed = moIdSeeds[moId];
  return { mp, moIdSeed };
}

function getRndOut(bus: Bus, moId: MoId, stepPos: number): number {
  const { mp, moIdSeed } = getMotionParamsAndSeed(bus, moId);
  return motion_mapping_core_internal.getRndMod(bus, mp, moIdSeed, stepPos);
}
function getRandMapped(
  bus: Bus,
  moId: MoId,
  stepPos: number,
  randomValueMapperFn?: RandomValueMapperFn,
): number {
  if (!randomValueMapperFn) return 0;
  const { mp, moIdSeed } = getMotionParamsAndSeed(bus, moId);
  return motion_mapping_core_internal.getRndMapped(
    bus,
    mp,
    moIdSeed,
    stepPos,
    randomValueMapperFn,
  );
}
function getEgLevel(bus: Bus, moId: MoId, stepPos: number): number {
  const { mp } = getMotionParamsAndSeed(bus, moId);
  return motion_mapping_core_internal.getMoEgLevel(bus, mp, stepPos);
}
function getLfoOut(bus: Bus, moId: MoId, stepPos: number): number {
  const { mp } = getMotionParamsAndSeed(bus, moId);
  return motion_mapping_core_internal.getLfoOut(mp, stepPos);
}

export function processMotionWrapper(
  bus: Bus,
  moId: MoId,
  stepPos: number,
  randomValueMapperFn?: RandomValueMapperFn,
): MotionPartValues {
  const { mp } = getMotionParamsAndSeed(bus, moId);
  const rndOut = getRndOut(bus, moId, stepPos); //0~1
  const rndMappedValue = getRandMapped(bus, moId, stepPos, randomValueMapperFn); //mapperFn出力による任意の範囲
  let egLevel = getEgLevel(bus, moId, stepPos); //0~1
  let lfoOut = getLfoOut(bus, moId, stepPos); //0~1
  if (mp.egInvert) {
    egLevel = 1 - egLevel; //0~1
  }
  if (mp.lfoInvert) {
    lfoOut = 1 - lfoOut;
  }
  const { moAmount } = mp;
  const isRand = mp.moType === MoType.rnd;
  const isLfo = mp.moType === MoType.lfo;
  const isEg = mp.moType === MoType.eg;
  const lfoOnGain = isLfo ? 1 : 0;
  const rndOnGain = isRand ? 1 : 0;
  const egOnGain = isEg ? 1 : 0;
  return {
    rndOut,
    rndMappedValue,
    egLevel,
    lfoOut,
    lfoDepth: moAmount,
    envMod: moAmount,
    rndRange: moAmount,
    lfoOnGain,
    rndOnGain,
    egOnGain,
  };
}
