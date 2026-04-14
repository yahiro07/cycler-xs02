import {
  BassPresetKey,
  BassTailAccentPatternKey,
  DelayStep,
  ExGaterCode,
  GaterExSourceStride,
  GaterSourceStride,
  GaterType,
  GateSequencerCode,
  KickPresetKey,
  LfoWave,
  LoopBarsKey,
  MoEgWave,
  MoRndMode,
  MoType,
  MotionStride,
  OscColorMode,
  OscPitchMode,
  OscUnisonMode,
  OscWave,
  RandomizeLevel,
  ShaperMode,
} from "@dsp/base/parameter-defs";
import { ParameterId } from "@dsp/base/parameter-id";
import { SynthesisBus } from "@dsp/base/synthesis-bus";
import { getLoopBarsFromKey } from "@dsp/motions/funcs/steps-common";
import { m_round } from "@dsp/utils/math-utils";

function floatToBool(value: number) {
  return value > 0.5;
}

function floatToInt(value: number): number {
  return m_round(value);
}

function floatToEnum<T extends number>(value: number): T {
  return m_round(value) as T;
}

const pk = ParameterId;

export function parameterAssigner_applyParameter(
  bus: SynthesisBus,
  id: number,
  value: number,
) {
  const sp = bus.parameters;
  if (id === pk.parametersVersion) bus.paramVer = floatToInt(value);
  if (id === pk.internalBpm) bus.bpm = value;
  if (id === pk.loopBars)
    bus.loopBars = getLoopBarsFromKey(floatToEnum<LoopBarsKey>(value));
  //
  if (id === pk.oscOn) sp.oscOn = floatToBool(value);
  if (id === pk.oscWave) sp.oscWave = floatToEnum<OscWave>(value);
  if (id === pk.oscOctave) sp.oscOctave = value;
  if (id === pk.oscPitch) sp.oscPitch = value;
  if (id === pk.oscPitchMode)
    sp.oscPitchMode = floatToEnum<OscPitchMode>(value);
  if (id === pk.oscPitchMoSmooth) sp.oscPitchMoSmooth = floatToBool(value);
  if (id === pk.oscColor) sp.oscColor = value;
  if (id === pk.oscColorMode)
    sp.oscColorMode = floatToEnum<OscColorMode>(value);
  if (id === pk.oscUnisonMode)
    sp.oscUnisonMode = floatToEnum<OscUnisonMode>(value);
  if (id === pk.oscUnisonDetune) sp.oscUnisonDetune = value;
  if (id === pk.filterOn) sp.filterOn = floatToBool(value);
  if (id === pk.filterCutoff) sp.filterCutoff = value;
  if (id === pk.filterPeak) sp.filterPeak = value;
  if (id === pk.ampOn) sp.ampOn = floatToBool(value);
  if (id === pk.ampEgHold) sp.ampEgHold = value;
  if (id === pk.ampEgDecay) sp.ampEgDecay = value;
  if (id === pk.shaperOn) sp.shaperOn = floatToBool(value);
  if (id === pk.shaperMode) sp.shaperMode = floatToEnum<ShaperMode>(value);
  if (id === pk.shaperLevel) sp.shaperLevel = value;
  if (id === pk.phaserOn) sp.phaserOn = floatToBool(value);
  if (id === pk.phaserLevel) sp.phaserLevel = value;
  if (id === pk.delayOn) sp.delayOn = floatToBool(value);
  if (id === pk.delayTime) sp.delayTime = value;
  if (id === pk.delayFeed) sp.delayFeed = value;
  if (id === pk.stepDelayOn) sp.stepDelayOn = floatToBool(value);
  if (id === pk.stepDelayStep) sp.stepDelayStep = floatToEnum<DelayStep>(value);
  if (id === pk.stepDelayFeed) sp.stepDelayFeed = value;
  if (id === pk.stepDelayMix) sp.stepDelayMix = value;
  if (id === pk.moOscPitch_moOn) sp.moOscPitch.moOn = floatToBool(value);
  if (id === pk.moOscPitch_moAmount) sp.moOscPitch.moAmount = value;
  if (id === pk.moOscPitch_moType)
    sp.moOscPitch.moType = floatToEnum<MoType>(value);
  if (id === pk.moOscPitch_rndStride)
    sp.moOscPitch.rndStride = floatToEnum<MotionStride>(value);
  if (id === pk.moOscPitch_rndMode)
    sp.moOscPitch.rndMode = floatToEnum<MoRndMode>(value);
  if (id === pk.moOscPitch_rndCover) sp.moOscPitch.rndCover = value;
  if (id === pk.moOscPitch_lfoWave)
    sp.moOscPitch.lfoWave = floatToEnum<LfoWave>(value);
  if (id === pk.moOscPitch_lfoRate) sp.moOscPitch.lfoRate = value;
  if (id === pk.moOscPitch_lfoRateStepped)
    sp.moOscPitch.lfoRateStepped = floatToBool(value);
  if (id === pk.moOscPitch_lfoInvert)
    sp.moOscPitch.lfoInvert = floatToBool(value);
  if (id === pk.moOscPitch_egStride)
    sp.moOscPitch.egStride = floatToEnum<MotionStride>(value);
  if (id === pk.moOscPitch_egWave)
    sp.moOscPitch.egWave = floatToEnum<MoEgWave>(value);
  if (id === pk.moOscPitch_egCurve) sp.moOscPitch.egCurve = value;
  if (id === pk.moOscPitch_egInvert)
    sp.moOscPitch.egInvert = floatToBool(value);
  if (id === pk.moOscColor_moOn) sp.moOscColor.moOn = floatToBool(value);
  if (id === pk.moOscColor_moAmount) sp.moOscColor.moAmount = value;
  if (id === pk.moOscColor_moType)
    sp.moOscColor.moType = floatToEnum<MoType>(value);
  if (id === pk.moOscColor_rndStride)
    sp.moOscColor.rndStride = floatToEnum<MotionStride>(value);
  if (id === pk.moOscColor_rndMode)
    sp.moOscColor.rndMode = floatToEnum<MoRndMode>(value);
  if (id === pk.moOscColor_rndCover) sp.moOscColor.rndCover = value;
  if (id === pk.moOscColor_lfoWave)
    sp.moOscColor.lfoWave = floatToEnum<LfoWave>(value);
  if (id === pk.moOscColor_lfoRate) sp.moOscColor.lfoRate = value;
  if (id === pk.moOscColor_lfoRateStepped)
    sp.moOscColor.lfoRateStepped = floatToBool(value);
  if (id === pk.moOscColor_lfoInvert)
    sp.moOscColor.lfoInvert = floatToBool(value);
  if (id === pk.moOscColor_egStride)
    sp.moOscColor.egStride = floatToEnum<MotionStride>(value);
  if (id === pk.moOscColor_egWave)
    sp.moOscColor.egWave = floatToEnum<MoEgWave>(value);
  if (id === pk.moOscColor_egCurve) sp.moOscColor.egCurve = value;
  if (id === pk.moOscColor_egInvert)
    sp.moOscColor.egInvert = floatToBool(value);
  if (id === pk.moFilterCutoff_moOn)
    sp.moFilterCutoff.moOn = floatToBool(value);
  if (id === pk.moFilterCutoff_moAmount) sp.moFilterCutoff.moAmount = value;
  if (id === pk.moFilterCutoff_moType)
    sp.moFilterCutoff.moType = floatToEnum<MoType>(value);
  if (id === pk.moFilterCutoff_rndStride)
    sp.moFilterCutoff.rndStride = floatToEnum<MotionStride>(value);
  if (id === pk.moFilterCutoff_rndMode)
    sp.moFilterCutoff.rndMode = floatToEnum<MoRndMode>(value);
  if (id === pk.moFilterCutoff_rndCover) sp.moFilterCutoff.rndCover = value;
  if (id === pk.moFilterCutoff_lfoWave)
    sp.moFilterCutoff.lfoWave = floatToEnum<LfoWave>(value);
  if (id === pk.moFilterCutoff_lfoRate) sp.moFilterCutoff.lfoRate = value;
  if (id === pk.moFilterCutoff_lfoRateStepped)
    sp.moFilterCutoff.lfoRateStepped = floatToBool(value);
  if (id === pk.moFilterCutoff_lfoInvert)
    sp.moFilterCutoff.lfoInvert = floatToBool(value);
  if (id === pk.moFilterCutoff_egStride)
    sp.moFilterCutoff.egStride = floatToEnum<MotionStride>(value);
  if (id === pk.moFilterCutoff_egWave)
    sp.moFilterCutoff.egWave = floatToEnum<MoEgWave>(value);
  if (id === pk.moFilterCutoff_egCurve) sp.moFilterCutoff.egCurve = value;
  if (id === pk.moFilterCutoff_egInvert)
    sp.moFilterCutoff.egInvert = floatToBool(value);
  if (id === pk.moShaperLevel_moOn) sp.moShaperLevel.moOn = floatToBool(value);
  if (id === pk.moShaperLevel_moAmount) sp.moShaperLevel.moAmount = value;
  if (id === pk.moShaperLevel_moType)
    sp.moShaperLevel.moType = floatToEnum<MoType>(value);
  if (id === pk.moShaperLevel_rndStride)
    sp.moShaperLevel.rndStride = floatToEnum<MotionStride>(value);
  if (id === pk.moShaperLevel_rndMode)
    sp.moShaperLevel.rndMode = floatToEnum<MoRndMode>(value);
  if (id === pk.moShaperLevel_rndCover) sp.moShaperLevel.rndCover = value;
  if (id === pk.moShaperLevel_lfoWave)
    sp.moShaperLevel.lfoWave = floatToEnum<LfoWave>(value);
  if (id === pk.moShaperLevel_lfoRate) sp.moShaperLevel.lfoRate = value;
  if (id === pk.moShaperLevel_lfoRateStepped)
    sp.moShaperLevel.lfoRateStepped = floatToBool(value);
  if (id === pk.moShaperLevel_lfoInvert)
    sp.moShaperLevel.lfoInvert = floatToBool(value);
  if (id === pk.moShaperLevel_egStride)
    sp.moShaperLevel.egStride = floatToEnum<MotionStride>(value);
  if (id === pk.moShaperLevel_egWave)
    sp.moShaperLevel.egWave = floatToEnum<MoEgWave>(value);
  if (id === pk.moShaperLevel_egCurve) sp.moShaperLevel.egCurve = value;
  if (id === pk.moShaperLevel_egInvert)
    sp.moShaperLevel.egInvert = floatToBool(value);
  if (id === pk.moPhaserLevel_moOn) sp.moPhaserLevel.moOn = floatToBool(value);
  if (id === pk.moPhaserLevel_moAmount) sp.moPhaserLevel.moAmount = value;
  if (id === pk.moPhaserLevel_moType)
    sp.moPhaserLevel.moType = floatToEnum<MoType>(value);
  if (id === pk.moPhaserLevel_rndStride)
    sp.moPhaserLevel.rndStride = floatToEnum<MotionStride>(value);
  if (id === pk.moPhaserLevel_rndMode)
    sp.moPhaserLevel.rndMode = floatToEnum<MoRndMode>(value);
  if (id === pk.moPhaserLevel_rndCover) sp.moPhaserLevel.rndCover = value;
  if (id === pk.moPhaserLevel_lfoWave)
    sp.moPhaserLevel.lfoWave = floatToEnum<LfoWave>(value);
  if (id === pk.moPhaserLevel_lfoRate) sp.moPhaserLevel.lfoRate = value;
  if (id === pk.moPhaserLevel_lfoRateStepped)
    sp.moPhaserLevel.lfoRateStepped = floatToBool(value);
  if (id === pk.moPhaserLevel_lfoInvert)
    sp.moPhaserLevel.lfoInvert = floatToBool(value);
  if (id === pk.moPhaserLevel_egStride)
    sp.moPhaserLevel.egStride = floatToEnum<MotionStride>(value);
  if (id === pk.moPhaserLevel_egWave)
    sp.moPhaserLevel.egWave = floatToEnum<MoEgWave>(value);
  if (id === pk.moPhaserLevel_egCurve) sp.moPhaserLevel.egCurve = value;
  if (id === pk.moPhaserLevel_egInvert)
    sp.moPhaserLevel.egInvert = floatToBool(value);
  if (id === pk.moDelayTime_moOn) sp.moDelayTime.moOn = floatToBool(value);
  if (id === pk.moDelayTime_moAmount) sp.moDelayTime.moAmount = value;
  if (id === pk.moDelayTime_moType)
    sp.moDelayTime.moType = floatToEnum<MoType>(value);
  if (id === pk.moDelayTime_rndStride)
    sp.moDelayTime.rndStride = floatToEnum<MotionStride>(value);
  if (id === pk.moDelayTime_rndMode)
    sp.moDelayTime.rndMode = floatToEnum<MoRndMode>(value);
  if (id === pk.moDelayTime_rndCover) sp.moDelayTime.rndCover = value;
  if (id === pk.moDelayTime_lfoWave)
    sp.moDelayTime.lfoWave = floatToEnum<LfoWave>(value);
  if (id === pk.moDelayTime_lfoRate) sp.moDelayTime.lfoRate = value;
  if (id === pk.moDelayTime_lfoRateStepped)
    sp.moDelayTime.lfoRateStepped = floatToBool(value);
  if (id === pk.moDelayTime_lfoInvert)
    sp.moDelayTime.lfoInvert = floatToBool(value);
  if (id === pk.moDelayTime_egStride)
    sp.moDelayTime.egStride = floatToEnum<MotionStride>(value);
  if (id === pk.moDelayTime_egWave)
    sp.moDelayTime.egWave = floatToEnum<MoEgWave>(value);
  if (id === pk.moDelayTime_egCurve) sp.moDelayTime.egCurve = value;
  if (id === pk.moDelayTime_egInvert)
    sp.moDelayTime.egInvert = floatToBool(value);
  if (id === pk.gaterStride)
    sp.gaterStride = floatToEnum<GaterSourceStride>(value);
  if (id === pk.gaterType) sp.gaterType = floatToEnum<GaterType>(value);
  if (id === pk.gaterRndTieOn) sp.gaterRndTieOn = floatToBool(value);
  if (id === pk.gaterRndTieCover) sp.gaterRndTieCover = value;
  if (id === pk.gaterSeqPatterns_0)
    sp.gaterSeqPatterns[0] = floatToEnum<GateSequencerCode>(value);
  if (id === pk.gaterSeqPatterns_1)
    sp.gaterSeqPatterns[1] = floatToEnum<GateSequencerCode>(value);
  if (id === pk.gaterSeqPatterns_2)
    sp.gaterSeqPatterns[2] = floatToEnum<GateSequencerCode>(value);
  if (id === pk.gaterSeqPatterns_3)
    sp.gaterSeqPatterns[3] = floatToEnum<GateSequencerCode>(value);
  if (id === pk.exGaterSeqStride)
    sp.exGaterSeqStride = floatToEnum<GaterExSourceStride>(value);
  if (id === pk.exGaterCodes_0)
    sp.exGaterCodes[0] = floatToEnum<ExGaterCode>(value);
  if (id === pk.exGaterCodes_1)
    sp.exGaterCodes[1] = floatToEnum<ExGaterCode>(value);
  if (id === pk.exGaterCodes_2)
    sp.exGaterCodes[2] = floatToEnum<ExGaterCode>(value);
  if (id === pk.exGaterCodes_3)
    sp.exGaterCodes[3] = floatToEnum<ExGaterCode>(value);
  if (id === pk.kickOn) sp.kickOn = floatToBool(value);
  if (id === pk.kickPresetKey)
    sp.kickPresetKey = floatToEnum<KickPresetKey>(value);
  if (id === pk.bassOn) sp.bassOn = floatToBool(value);
  if (id === pk.bassDuty) sp.bassDuty = value;
  if (id === pk.bassPresetKey)
    sp.bassPresetKey = floatToEnum<BassPresetKey>(value);
  if (id === pk.bassTailAccentPatternKey)
    sp.bassTailAccentPatternKey = floatToEnum<BassTailAccentPatternKey>(value);
  if (id === pk.kickVolume) sp.kickVolume = value;
  if (id === pk.bassVolume) sp.bassVolume = value;
  if (id === pk.synthVolume) sp.synthVolume = value;
  if (id === pk.looped) sp.looped = floatToBool(value);
  if (id === pk.masterVolume) sp.masterVolume = value;
  if (id === pk.clockingOn) sp.clockingOn = floatToBool(value);
  if (id === pk.baseNoteIndex) sp.baseNoteIndex = value;
  if (id === pk.autoRandomizeOnLoop)
    sp.autoRandomizeOnLoop = floatToBool(value);
  if (id === pk.randomizeLevel)
    sp.randomizeLevel = floatToEnum<RandomizeLevel>(value);
}
