import { createEnumOptions } from "@/common/selector-option";
import { masterGainConfig } from "@/logic/master-gain-config";

export enum OscWave {
  saw,
  rect,
  tri,
  sine,
}
export const oscWaveOptions = createEnumOptions<OscWave>([
  [OscWave.saw, "saw"],
  [OscWave.rect, "rect"],
  [OscWave.tri, "tri"],
  [OscWave.sine, "sine"],
]);

export enum LfoWave {
  sine,
  rect,
  tri,
  saw,
}
export const lfoWaveOptions = createEnumOptions<LfoWave>([
  [LfoWave.sine, "sine"],
  [LfoWave.rect, "rect"],
  [LfoWave.tri, "tri"],
  [LfoWave.saw, "saw"],
]);

export enum DelayStep {
  div16,
  div8,
  div4,
}
export const delayStepOptions = createEnumOptions<DelayStep>([
  [DelayStep.div4, "/4"],
  [DelayStep.div8, "/8"],
  [DelayStep.div16, "/16"],
]);

export enum OscPitchMode {
  linear,
  octave,
  oct_x,
  ratio,
  semi,
  map1,
  map2,
  map3,
}
export const oscPitchModeOptions = createEnumOptions<OscPitchMode>([
  [OscPitchMode.octave, "octave"],
  [OscPitchMode.oct_x, "oct-x"],
  [OscPitchMode.linear, "linear"],
  [OscPitchMode.ratio, "ratio"],
  [OscPitchMode.semi, "semi"],
  [OscPitchMode.map1, "map1"],
  [OscPitchMode.map2, "map2"],
  [OscPitchMode.map3, "map3"],
]);

export enum PureStride {
  div16,
  div8,
  div4,
  div2,
  mul1,
  mul2,
  mul4,
}
export enum GateStride {
  div16,
  div8,
  div4,
  div2,
  mul1,
  mul2,
  mul4,
  gate,
}
export const gateStrideOptions = createEnumOptions<GateStride>([
  [GateStride.mul4, "4"],
  [GateStride.mul2, "2"],
  [GateStride.mul1, "1"],
  [GateStride.div2, "/2"],
  [GateStride.div4, "/4"],
  [GateStride.div8, "/8"],
  [GateStride.div16, "/16"],
  [GateStride.gate, "gate"],
]);

export enum MotionStride {
  div16 = 0,
  div8,
  div4,
  div2,
  mul1,
  mul2,
  mul4,
  gate,
  ex,
}
export const motionStrideOptions = createEnumOptions<MotionStride>([
  [MotionStride.mul4, "4"],
  [MotionStride.mul2, "2"],
  [MotionStride.mul1, "1"],
  [MotionStride.div2, "/2"],
  [MotionStride.div4, "/4"],
  [MotionStride.div8, "/8"],
  [MotionStride.div16, "/16"],
  [MotionStride.gate, "gate"],
  [MotionStride.ex, "ex"],
]);

export enum GaterSourceStride {
  div16,
  div8,
  div4,
}
export const gaterSourceStrideOptions = createEnumOptions<GaterSourceStride>([
  [GaterSourceStride.div4, "/4"],
  [GaterSourceStride.div8, "/8"],
  [GaterSourceStride.div16, "/16"],
]);

export enum GaterExSourceStride {
  div16,
  div8,
  div4,
  div2,
  mul1,
}
export const gaterExSourceStrideOptions =
  createEnumOptions<GaterExSourceStride>([
    [GaterExSourceStride.mul1, "1"],
    [GaterExSourceStride.div2, "/2"],
    [GaterExSourceStride.div4, "/4"],
    [GaterExSourceStride.div8, "/8"],
    [GaterExSourceStride.div16, "/16"],
  ]);

export enum GaterType {
  seq,
  lax,
}
export const gaterTypeOptions = createEnumOptions<GaterType>([
  [GaterType.seq, "seq"],
  [GaterType.lax, "lax"],
]);
export enum GateSequencerCode {
  code0,
  code1,
  code2,
  code3,
  code4,
  code5,
}
export const gateSequencerCodeValues = [
  GateSequencerCode.code0,
  GateSequencerCode.code1,
  GateSequencerCode.code2,
  GateSequencerCode.code3,
  GateSequencerCode.code4,
  GateSequencerCode.code5,
];
export const gateSequencerCodeValuesForHead = [
  GateSequencerCode.code0,
  GateSequencerCode.code1,
  GateSequencerCode.code2,
  GateSequencerCode.code3,
];
export enum MoEgWave {
  d,
  d2,
  ad,
  bump,
  duty,
  stair,
}
export const moEgWaveOptions = createEnumOptions<MoEgWave>([
  [MoEgWave.d, "d"],
  [MoEgWave.d2, "d2"],
  [MoEgWave.ad, "ad"],
  [MoEgWave.bump, "bump"],
  [MoEgWave.duty, "duty"],
  [MoEgWave.stair, "stair"],
]);

export enum ExGaterCode {
  one,
  off,
  tie,
  double,
}
export const exGaterCodeValues = [
  ExGaterCode.one,
  ExGaterCode.off,
  ExGaterCode.tie,
  ExGaterCode.double,
];
export const exGaterCodeValuesForHead = [
  ExGaterCode.one,
  ExGaterCode.off,
  ExGaterCode.double,
];
export enum MoRndMode {
  sh,
  sd,
  sg,
}
export const moRndModeOptions = createEnumOptions<MoRndMode>([
  [MoRndMode.sh, "sh"],
  [MoRndMode.sd, "sd"],
  [MoRndMode.sg, "sg"],
]);

export enum OscColorMode {
  sfm,
  speed,
  accel,
  drill,
  sdm,
  creep,
  sinus,
  ridge,
}
export const oscColorModeOptions = createEnumOptions<OscColorMode>([
  [OscColorMode.sfm, "sfm"],
  [OscColorMode.speed, "speed"],
  [OscColorMode.accel, "accel"],
  [OscColorMode.drill, "drill"],
  [OscColorMode.sdm, "sdm"],
  [OscColorMode.creep, "creep"],
  [OscColorMode.sinus, "sinus"],
  [OscColorMode.ridge, "ridge"],
]);

export enum ShaperMode {
  ws1,
  ws2,
  ws3,
  ws4,
  ws5,
}
export const shaperModeOptions = createEnumOptions<ShaperMode>([
  [ShaperMode.ws1, "ws1"],
  [ShaperMode.ws2, "ws2"],
  [ShaperMode.ws3, "ws3"],
  [ShaperMode.ws4, "ws4"],
  [ShaperMode.ws5, "ws5"],
]);

export enum OscUnisonMode {
  one,
  det2,
  det3,
  sub,
  fifth,
}
export const oscUnisonModeOptions = createEnumOptions<OscUnisonMode>([
  [OscUnisonMode.one, "one"],
  [OscUnisonMode.det2, "det2"],
  [OscUnisonMode.det3, "det3"],
  [OscUnisonMode.sub, "sub"],
  [OscUnisonMode.fifth, "fifth"],
]);

export enum MoType {
  lfo,
  eg,
  rnd,
}
export const moTypeValues = [MoType.lfo, MoType.eg, MoType.rnd];

export enum KickPresetKey {
  kick1,
  kick2,
  kick3,
  kick4,
  kick5,
}
export const kickPresetKeyOptions = createEnumOptions<KickPresetKey>([
  [KickPresetKey.kick1, "kick1"],
  [KickPresetKey.kick2, "kick2"],
  [KickPresetKey.kick3, "kick3"],
  [KickPresetKey.kick4, "kick4"],
  [KickPresetKey.kick5, "kick5"],
]);

export enum BassPresetKey {
  bass1,
  bass2,
  bass3,
  bass4,
}
export const bassPresetKeyOptions = createEnumOptions<BassPresetKey>([
  [BassPresetKey.bass1, "bass1"],
  [BassPresetKey.bass2, "bass2"],
  [BassPresetKey.bass3, "bass3"],
  [BassPresetKey.bass4, "bass4"],
]);

export enum BassTailAccentPatternKey {
  off,
  pattern1,
  pattern2,
  pattern3,
  pattern4,
}
export const bassTailAccentPatternKeyOptions =
  createEnumOptions<BassTailAccentPatternKey>([
    [BassTailAccentPatternKey.off, "--"],
    [BassTailAccentPatternKey.pattern1, "1"],
    [BassTailAccentPatternKey.pattern2, "2"],
    [BassTailAccentPatternKey.pattern3, "3"],
    [BassTailAccentPatternKey.pattern4, "4"],
  ]);

export enum LoopBarsKey {
  bar1,
  bar2,
  bar4,
}
export const loopBarsOptions = createEnumOptions<LoopBarsKey>([
  [LoopBarsKey.bar1, "1"],
  [LoopBarsKey.bar2, "2"],
  [LoopBarsKey.bar4, "4"],
]);

export const bpmRanges = {
  min: 90,
  max: 180,
};

export enum RandomizeLevel {
  rnd1,
  rnd2,
  rnd5,
  rnd10,
  rnd20,
  rndFull,
}
export const randomizeLevelOptions = createEnumOptions<RandomizeLevel>([
  [RandomizeLevel.rnd1, "1"],
  [RandomizeLevel.rnd2, "2"],
  [RandomizeLevel.rnd5, "5"],
  [RandomizeLevel.rnd10, "10"],
  [RandomizeLevel.rnd20, "20"],
  [RandomizeLevel.rndFull, "Full"],
]);

export type MoId =
  | "moOscPitch"
  | "moOscColor"
  | "moFilterCutoff"
  | "moShaperLevel"
  | "moPhaserLevel"
  | "moDelayTime";

type FlatMotionParams<Mo extends MoId> = {
  [K in `${Mo}_moOn`]: boolean;
} & {
  [K in `${Mo}_moType`]: MoType;
} & {
  [K in `${Mo}_moAmount`]: number;
} & {
  [K in `${Mo}_rndStride`]: MotionStride;
} & {
  [K in `${Mo}_rndMode`]: MoRndMode;
} & {
  [K in `${Mo}_rndCover`]: number;
} & {
  [K in `${Mo}_lfoWave`]: LfoWave;
} & {
  [K in `${Mo}_lfoRate`]: number;
} & {
  [K in `${Mo}_lfoRateStepped`]: boolean;
} & {
  [K in `${Mo}_lfoInvert`]: boolean;
} & {
  [K in `${Mo}_egStride`]: MotionStride;
} & {
  [K in `${Mo}_egWave`]: MoEgWave;
} & {
  [K in `${Mo}_egCurve`]: number;
} & {
  [K in `${Mo}_egInvert`]: boolean;
};

function flatMotionParamsDefault<Mo extends MoId>(
  mo: Mo,
  moTypeDefault: MoType,
): FlatMotionParams<Mo> {
  return {
    [`${mo}_moOn`]: false,
    [`${mo}_moType`]: moTypeDefault,
    [`${mo}_moAmount`]: 0.5,
    [`${mo}_rndStride`]: MotionStride.gate,
    [`${mo}_rndMode`]: MoRndMode.sh,
    [`${mo}_rndCover`]: 1,
    [`${mo}_lfoWave`]: LfoWave.sine,
    [`${mo}_lfoRate`]: 0.5,
    [`${mo}_lfoRateStepped`]: false,
    [`${mo}_lfoInvert`]: false,
    [`${mo}_egStride`]: MotionStride.gate,
    [`${mo}_egWave`]: MoEgWave.d,
    [`${mo}_egCurve`]: 0.5,
    [`${mo}_egInvert`]: false,
  } as FlatMotionParams<Mo>;
}

export type SynthParametersSuit = {
  parametersVersion: number;
  //
  oscOn: boolean;
  oscWave: OscWave;
  oscPitch: number;
  oscPitchMode: OscPitchMode;
  oscPitchMoSmooth: boolean;
  oscOctave: number;
  oscColor: number;
  oscColorMode: OscColorMode;
  oscUnisonMode: OscUnisonMode;
  oscUnisonDetune: number;
  //
  filterOn: boolean;
  filterCutoff: number;
  filterPeak: number;
  //
  ampOn: boolean;
  ampEgHold: number;
  ampEgDecay: number;
  //
  shaperOn: boolean;
  shaperMode: ShaperMode;
  shaperLevel: number;
  //
  phaserOn: boolean;
  phaserLevel: number;
  //
  delayOn: boolean;
  delayTime: number;
  delayFeed: number;
  //
  stepDelayOn: boolean;
  stepDelayStep: DelayStep;
  stepDelayFeed: number;
  stepDelayMix: number;
  gaterStride: GaterSourceStride;
  gaterType: GaterType;
  gaterRndTieOn: boolean;
  gaterRndTieCover: number;
  exGaterSeqStride: GaterExSourceStride;
  gaterSeqPatterns_0: GateSequencerCode;
  gaterSeqPatterns_1: GateSequencerCode;
  gaterSeqPatterns_2: GateSequencerCode;
  gaterSeqPatterns_3: GateSequencerCode;
  exGaterCodes_0: ExGaterCode;
  exGaterCodes_1: ExGaterCode;
  exGaterCodes_2: ExGaterCode;
  exGaterCodes_3: ExGaterCode;
  //
  kickOn: boolean;
  kickPresetKey: KickPresetKey;
  bassOn: boolean;
  bassDuty: number;
  bassPresetKey: BassPresetKey;
  bassTailAccentPatternKey: BassTailAccentPatternKey;
  //
  kickVolume: number;
  bassVolume: number;
  synthVolume: number;
  //
  loopBars: LoopBarsKey;
  looped: boolean;
  masterVolume: number;
  clockingOn: boolean;
  // baseOctave: number;
  baseNoteIndex: number;
  //
  internalBpm: number;
  autoRandomizeOnLoop: boolean;
  randomizeLevel: RandomizeLevel;
} & FlatMotionParams<"moOscPitch"> &
  FlatMotionParams<"moOscColor"> &
  FlatMotionParams<"moFilterCutoff"> &
  FlatMotionParams<"moShaperLevel"> &
  FlatMotionParams<"moPhaserLevel"> &
  FlatMotionParams<"moDelayTime">;

export const defaultSynthParameters: SynthParametersSuit = {
  parametersVersion: 1,
  //
  oscOn: true,
  oscWave: OscWave.saw,
  oscOctave: 0,
  oscPitch: 0.5,
  oscPitchMode: OscPitchMode.octave,
  oscPitchMoSmooth: false,
  oscColor: 0,
  oscColorMode: OscColorMode.sfm,
  oscUnisonMode: OscUnisonMode.one,
  oscUnisonDetune: 0,
  //
  filterOn: true,
  filterCutoff: 1,
  filterPeak: 0,
  //
  ampOn: true,
  ampEgHold: 0.8,
  ampEgDecay: 0,
  //
  shaperOn: false,
  shaperMode: ShaperMode.ws1,
  shaperLevel: 0.5,
  //
  phaserOn: false,
  phaserLevel: 0.5,
  //
  delayOn: false,
  delayTime: 0.5,
  delayFeed: 0.3,
  //
  stepDelayOn: false,
  stepDelayStep: DelayStep.div8,
  stepDelayFeed: 0.5,
  stepDelayMix: 0.5,
  //
  gaterStride: GaterSourceStride.div16,
  gaterType: GaterType.seq,
  gaterRndTieOn: false,
  gaterRndTieCover: 0.5,
  exGaterSeqStride: GaterExSourceStride.div16,
  gaterSeqPatterns_0: GateSequencerCode.code0,
  gaterSeqPatterns_1: GateSequencerCode.code0,
  gaterSeqPatterns_2: GateSequencerCode.code0,
  gaterSeqPatterns_3: GateSequencerCode.code0,
  exGaterCodes_0: ExGaterCode.one,
  exGaterCodes_1: ExGaterCode.one,
  exGaterCodes_2: ExGaterCode.one,
  exGaterCodes_3: ExGaterCode.one,
  //
  kickOn: true,
  kickPresetKey: KickPresetKey.kick1,
  bassOn: true,
  bassDuty: 0.6,
  bassPresetKey: BassPresetKey.bass1,
  bassTailAccentPatternKey: BassTailAccentPatternKey.off,
  //
  kickVolume: 1,
  bassVolume: 1,
  synthVolume: 1,
  //
  loopBars: LoopBarsKey.bar2,
  looped: false,
  masterVolume: masterGainConfig.levelCenter,
  clockingOn: true,
  // baseOctave: 3,
  baseNoteIndex: 9, //A
  //
  internalBpm: 130,
  autoRandomizeOnLoop: false,
  randomizeLevel: RandomizeLevel.rnd10,
  //
  ...flatMotionParamsDefault("moOscPitch", MoType.rnd),
  ...flatMotionParamsDefault("moOscColor", MoType.eg),
  ...flatMotionParamsDefault("moFilterCutoff", MoType.lfo),
  ...flatMotionParamsDefault("moShaperLevel", MoType.rnd),
  ...flatMotionParamsDefault("moPhaserLevel", MoType.eg),
  ...flatMotionParamsDefault("moDelayTime", MoType.lfo),
};

export type ParameterKey = keyof SynthParametersSuit;
