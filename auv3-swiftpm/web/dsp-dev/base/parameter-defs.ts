import { masterGainConfig } from "@core/dsp-modules/basic/master-gain-config";

export enum OscWave {
  saw,
  rect,
  tri,
  sine,
}
export enum LfoWave {
  sine,
  rect,
  tri,
  saw,
}
export enum DelayStep {
  div16,
  div8,
  div4,
}
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
export enum GaterSourceStride {
  div16,
  div8,
  div4,
}
export enum GaterExSourceStride {
  div16,
  div8,
  div4,
  div2,
  mul1,
}
export enum GaterType {
  seq,
  lax,
}
export enum GateSequencerCode {
  code0,
  code1,
  code2,
  code3,
  code4,
  code5,
}
export enum MoEgWave {
  d,
  d2,
  ad,
  bump,
  duty,
  stair,
}
export enum ExGaterCode {
  one,
  off,
  tie,
  double,
}
export enum MoRndMode {
  sh,
  sd,
  sg,
}
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
export enum ShaperMode {
  ws1,
  ws2,
  ws3,
  ws4,
  ws5,
}
export enum OscUnisonMode {
  one,
  det2,
  det3,
  sub,
  fifth,
}
export enum MoType {
  lfo,
  eg,
  rnd,
}
export enum MoId {
  oscPitch,
  oscColor,
  filterCutoff,
  shaperLevel,
  delayTime,
  phaserLevel,
}
export enum KickPresetKey {
  kick1,
  kick2,
  kick3,
  kick4,
  kick5,
}
export enum BassPresetKey {
  bass1,
  bass2,
  bass3,
  bass4,
}
export enum BassTailAccentPatternKey {
  off,
  pattern1,
  pattern2,
  pattern3,
  pattern4,
}
export enum LoopBarsKey {
  bar1,
  bar2,
  bar4,
}
export type MotionParams = {
  moOn: boolean;
  moType: MoType;
  moAmount: number;
  rndStride: MotionStride;
  rndMode: MoRndMode;
  rndCover: number;
  lfoWave: LfoWave;
  lfoRate: number;
  lfoRateStepped: boolean;
  lfoInvert: boolean;
  egStride: MotionStride;
  egWave: MoEgWave;
  egCurve: number;
  egInvert: boolean;
};

export enum RandomizeLevel {
  rnd1,
  rnd2,
  rnd5,
  rnd10,
  rnd20,
  rndFull,
}

export type SynthParametersSuit = {
  // parametersVersion: number    //held in bus
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
  //
  moOscPitch: MotionParams;
  moOscColor: MotionParams;
  moFilterCutoff: MotionParams;
  moShaperLevel: MotionParams;
  moPhaserLevel: MotionParams;
  moDelayTime: MotionParams;
  //
  gaterStride: GaterSourceStride;
  gaterType: GaterType;
  gaterRndTieOn: boolean;
  gaterRndTieCover: number;
  gaterSeqPatterns: GateSequencerCode[]; //[4]
  exGaterSeqStride: GaterExSourceStride;
  exGaterCodes: ExGaterCode[];
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
  loopBars: number;
  looped: boolean;
  masterVolume: number;
  clockingOn: boolean;
  baseNoteIndex: number;
  //
  // internalBpm: number; //held in bus
  autoRandomizeOnLoop: boolean;
  randomizeLevel: RandomizeLevel;
};

const motionParamsDefault: MotionParams = {
  moOn: false,
  moAmount: 0.5,
  moType: MoType.rnd,
  rndStride: MotionStride.gate,
  rndMode: MoRndMode.sh,
  rndCover: 1,
  lfoWave: LfoWave.sine,
  lfoRate: 0.5,
  lfoRateStepped: false,
  lfoInvert: false,
  egStride: MotionStride.gate,
  egWave: MoEgWave.d,
  egCurve: 0.5,
  egInvert: false,
};

export function createSynthParametersSuit(): SynthParametersSuit {
  return {
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
    moOscPitch: { ...motionParamsDefault, moType: MoType.rnd },
    moOscColor: { ...motionParamsDefault, moType: MoType.eg },
    moFilterCutoff: { ...motionParamsDefault, moType: MoType.lfo },
    moShaperLevel: { ...motionParamsDefault, moType: MoType.rnd },
    moPhaserLevel: { ...motionParamsDefault, moType: MoType.eg },
    moDelayTime: { ...motionParamsDefault, moType: MoType.lfo },
    //
    gaterStride: GaterSourceStride.div16,
    gaterType: GaterType.seq,
    gaterRndTieOn: false,
    gaterRndTieCover: 0.5,
    gaterSeqPatterns: [
      GateSequencerCode.code0,
      GateSequencerCode.code0,
      GateSequencerCode.code0,
      GateSequencerCode.code0,
    ],
    exGaterSeqStride: GaterExSourceStride.div16,
    exGaterCodes: [
      ExGaterCode.one,
      ExGaterCode.one,
      ExGaterCode.one,
      ExGaterCode.one,
    ],
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
    loopBars: 2,
    looped: false,
    masterVolume: masterGainConfig.levelCenter,
    clockingOn: true,
    baseNoteIndex: 9, //A
    //
    autoRandomizeOnLoop: false,
    randomizeLevel: RandomizeLevel.rnd10,
  };
}
