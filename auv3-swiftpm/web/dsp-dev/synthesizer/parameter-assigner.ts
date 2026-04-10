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
  MoEgWave,
  MoRndMode,
  MoType,
  MotionStride,
  OscColorMode,
  OscPitchMode,
  OscUnisonMode,
  OscWave,
  ShaperMode,
  SynthParametersSuit,
} from "@core/base/parameter-defs";
import { ParameterId } from "@core/parameter-id";

function floatToBool(value: number) {
  return value > 0.5;
}

const pk = ParameterId;

export function parameterAssigner_applyParameter(
  sp: SynthParametersSuit,
  id: number,
  value: number,
) {
  if (id === pk.oscOn) sp.oscOn = floatToBool(value);
  if (id === pk.oscWave) sp.oscWave = value as OscWave;
  if (id === pk.oscOctave) sp.oscOctave = value;
  if (id === pk.oscPitch) sp.oscPitch = value;
  if (id === pk.oscPitchMode) sp.oscPitchMode = value as OscPitchMode;
  if (id === pk.oscPitchMoSmooth) sp.oscPitchMoSmooth = floatToBool(value);
  if (id === pk.oscColor) sp.oscColor = value;
  if (id === pk.oscColorMode) sp.oscColorMode = value as OscColorMode;
  if (id === pk.oscUnisonMode) sp.oscUnisonMode = value as OscUnisonMode;
  if (id === pk.oscUnisonDetune) sp.oscUnisonDetune = value;
  if (id === pk.filterOn) sp.filterOn = floatToBool(value);
  if (id === pk.filterCutoff) sp.filterCutoff = value;
  if (id === pk.filterPeak) sp.filterPeak = value;
  if (id === pk.ampOn) sp.ampOn = floatToBool(value);
  if (id === pk.ampEgHold) sp.ampEgHold = value;
  if (id === pk.ampEgDecay) sp.ampEgDecay = value;
  if (id === pk.shaperOn) sp.shaperOn = floatToBool(value);
  if (id === pk.shaperMode) sp.shaperMode = value as ShaperMode;
  if (id === pk.shaperLevel) sp.shaperLevel = value;
  if (id === pk.phaserOn) sp.phaserOn = floatToBool(value);
  if (id === pk.phaserLevel) sp.phaserLevel = value;
  if (id === pk.delayOn) sp.delayOn = floatToBool(value);
  if (id === pk.delayTime) sp.delayTime = value;
  if (id === pk.delayFeed) sp.delayFeed = value;
  if (id === pk.stepDelayOn) sp.stepDelayOn = floatToBool(value);
  if (id === pk.stepDelayStep) sp.stepDelayStep = value as DelayStep;
  if (id === pk.stepDelayFeed) sp.stepDelayFeed = value;
  if (id === pk.stepDelayMix) sp.stepDelayMix = value;
  if (id === pk.moOscPitch_moOn) sp.moOscPitch.moOn = floatToBool(value);
  if (id === pk.moOscPitch_moAmount) sp.moOscPitch.moAmount = value;
  if (id === pk.moOscPitch_moType) sp.moOscPitch.moType = value as MoType;
  if (id === pk.moOscPitch_rndStride)
    sp.moOscPitch.rndStride = value as MotionStride;
  if (id === pk.moOscPitch_rndMode) sp.moOscPitch.rndMode = value as MoRndMode;
  if (id === pk.moOscPitch_rndCover) sp.moOscPitch.rndCover = value;
  if (id === pk.moOscPitch_lfoWave) sp.moOscPitch.lfoWave = value as LfoWave;
  if (id === pk.moOscPitch_lfoRate) sp.moOscPitch.lfoRate = value;
  if (id === pk.moOscPitch_lfoRateStepped)
    sp.moOscPitch.lfoRateStepped = floatToBool(value);
  if (id === pk.moOscPitch_lfoInvert)
    sp.moOscPitch.lfoInvert = floatToBool(value);
  if (id === pk.moOscPitch_egStride)
    sp.moOscPitch.egStride = value as MotionStride;
  if (id === pk.moOscPitch_egWave) sp.moOscPitch.egWave = value as MoEgWave;
  if (id === pk.moOscPitch_egCurve) sp.moOscPitch.egCurve = value;
  if (id === pk.moOscPitch_egInvert)
    sp.moOscPitch.egInvert = floatToBool(value);
  if (id === pk.moOscColor_moOn) sp.moOscColor.moOn = floatToBool(value);
  if (id === pk.moOscColor_moAmount) sp.moOscColor.moAmount = value;
  if (id === pk.moOscColor_moType) sp.moOscColor.moType = value as MoType;
  if (id === pk.moOscColor_rndStride)
    sp.moOscColor.rndStride = value as MotionStride;
  if (id === pk.moOscColor_rndMode) sp.moOscColor.rndMode = value as MoRndMode;
  if (id === pk.moOscColor_rndCover) sp.moOscColor.rndCover = value;
  if (id === pk.moOscColor_lfoWave) sp.moOscColor.lfoWave = value as LfoWave;
  if (id === pk.moOscColor_lfoRate) sp.moOscColor.lfoRate = value;
  if (id === pk.moOscColor_lfoRateStepped)
    sp.moOscColor.lfoRateStepped = floatToBool(value);
  if (id === pk.moOscColor_lfoInvert)
    sp.moOscColor.lfoInvert = floatToBool(value);
  if (id === pk.moOscColor_egStride)
    sp.moOscColor.egStride = value as MotionStride;
  if (id === pk.moOscColor_egWave) sp.moOscColor.egWave = value as MoEgWave;
  if (id === pk.moOscColor_egCurve) sp.moOscColor.egCurve = value;
  if (id === pk.moOscColor_egInvert)
    sp.moOscColor.egInvert = floatToBool(value);
  if (id === pk.moFilterCutoff_moOn)
    sp.moFilterCutoff.moOn = floatToBool(value);
  if (id === pk.moFilterCutoff_moAmount) sp.moFilterCutoff.moAmount = value;
  if (id === pk.moFilterCutoff_moType)
    sp.moFilterCutoff.moType = value as MoType;
  if (id === pk.moFilterCutoff_rndStride)
    sp.moFilterCutoff.rndStride = value as MotionStride;
  if (id === pk.moFilterCutoff_rndMode)
    sp.moFilterCutoff.rndMode = value as MoRndMode;
  if (id === pk.moFilterCutoff_rndCover) sp.moFilterCutoff.rndCover = value;
  if (id === pk.moFilterCutoff_lfoWave)
    sp.moFilterCutoff.lfoWave = value as LfoWave;
  if (id === pk.moFilterCutoff_lfoRate) sp.moFilterCutoff.lfoRate = value;
  if (id === pk.moFilterCutoff_lfoRateStepped)
    sp.moFilterCutoff.lfoRateStepped = floatToBool(value);
  if (id === pk.moFilterCutoff_lfoInvert)
    sp.moFilterCutoff.lfoInvert = floatToBool(value);
  if (id === pk.moFilterCutoff_egStride)
    sp.moFilterCutoff.egStride = value as MotionStride;
  if (id === pk.moFilterCutoff_egWave)
    sp.moFilterCutoff.egWave = value as MoEgWave;
  if (id === pk.moFilterCutoff_egCurve) sp.moFilterCutoff.egCurve = value;
  if (id === pk.moFilterCutoff_egInvert)
    sp.moFilterCutoff.egInvert = floatToBool(value);
  if (id === pk.moShaperLevel_moOn) sp.moShaperLevel.moOn = floatToBool(value);
  if (id === pk.moShaperLevel_moAmount) sp.moShaperLevel.moAmount = value;
  if (id === pk.moShaperLevel_moType) sp.moShaperLevel.moType = value as MoType;
  if (id === pk.moShaperLevel_rndStride)
    sp.moShaperLevel.rndStride = value as MotionStride;
  if (id === pk.moShaperLevel_rndMode)
    sp.moShaperLevel.rndMode = value as MoRndMode;
  if (id === pk.moShaperLevel_rndCover) sp.moShaperLevel.rndCover = value;
  if (id === pk.moShaperLevel_lfoWave)
    sp.moShaperLevel.lfoWave = value as LfoWave;
  if (id === pk.moShaperLevel_lfoRate) sp.moShaperLevel.lfoRate = value;
  if (id === pk.moShaperLevel_lfoRateStepped)
    sp.moShaperLevel.lfoRateStepped = floatToBool(value);
  if (id === pk.moShaperLevel_lfoInvert)
    sp.moShaperLevel.lfoInvert = floatToBool(value);
  if (id === pk.moShaperLevel_egStride)
    sp.moShaperLevel.egStride = value as MotionStride;
  if (id === pk.moShaperLevel_egWave)
    sp.moShaperLevel.egWave = value as MoEgWave;
  if (id === pk.moShaperLevel_egCurve) sp.moShaperLevel.egCurve = value;
  if (id === pk.moShaperLevel_egInvert)
    sp.moShaperLevel.egInvert = floatToBool(value);
  if (id === pk.moPhaserLevel_moOn) sp.moPhaserLevel.moOn = floatToBool(value);
  if (id === pk.moPhaserLevel_moAmount) sp.moPhaserLevel.moAmount = value;
  if (id === pk.moPhaserLevel_moType) sp.moPhaserLevel.moType = value as MoType;
  if (id === pk.moPhaserLevel_rndStride)
    sp.moPhaserLevel.rndStride = value as MotionStride;
  if (id === pk.moPhaserLevel_rndMode)
    sp.moPhaserLevel.rndMode = value as MoRndMode;
  if (id === pk.moPhaserLevel_rndCover) sp.moPhaserLevel.rndCover = value;
  if (id === pk.moPhaserLevel_lfoWave)
    sp.moPhaserLevel.lfoWave = value as LfoWave;
  if (id === pk.moPhaserLevel_lfoRate) sp.moPhaserLevel.lfoRate = value;
  if (id === pk.moPhaserLevel_lfoRateStepped)
    sp.moPhaserLevel.lfoRateStepped = floatToBool(value);
  if (id === pk.moPhaserLevel_lfoInvert)
    sp.moPhaserLevel.lfoInvert = floatToBool(value);
  if (id === pk.moPhaserLevel_egStride)
    sp.moPhaserLevel.egStride = value as MotionStride;
  if (id === pk.moPhaserLevel_egWave)
    sp.moPhaserLevel.egWave = value as MoEgWave;
  if (id === pk.moPhaserLevel_egCurve) sp.moPhaserLevel.egCurve = value;
  if (id === pk.moPhaserLevel_egInvert)
    sp.moPhaserLevel.egInvert = floatToBool(value);
  if (id === pk.moDelayTime_moOn) sp.moDelayTime.moOn = floatToBool(value);
  if (id === pk.moDelayTime_moAmount) sp.moDelayTime.moAmount = value;
  if (id === pk.moDelayTime_moType) sp.moDelayTime.moType = value as MoType;
  if (id === pk.moDelayTime_rndStride)
    sp.moDelayTime.rndStride = value as MotionStride;
  if (id === pk.moDelayTime_rndMode)
    sp.moDelayTime.rndMode = value as MoRndMode;
  if (id === pk.moDelayTime_rndCover) sp.moDelayTime.rndCover = value;
  if (id === pk.moDelayTime_lfoWave) sp.moDelayTime.lfoWave = value as LfoWave;
  if (id === pk.moDelayTime_lfoRate) sp.moDelayTime.lfoRate = value;
  if (id === pk.moDelayTime_lfoRateStepped)
    sp.moDelayTime.lfoRateStepped = floatToBool(value);
  if (id === pk.moDelayTime_lfoInvert)
    sp.moDelayTime.lfoInvert = floatToBool(value);
  if (id === pk.moDelayTime_egStride)
    sp.moDelayTime.egStride = value as MotionStride;
  if (id === pk.moDelayTime_egWave) sp.moDelayTime.egWave = value as MoEgWave;
  if (id === pk.moDelayTime_egCurve) sp.moDelayTime.egCurve = value;
  if (id === pk.moDelayTime_egInvert)
    sp.moDelayTime.egInvert = floatToBool(value);
  if (id === pk.gaterStride) sp.gaterStride = value as GaterSourceStride;
  if (id === pk.gaterType) sp.gaterType = value as GaterType;
  if (id === pk.gaterRndTieOn) sp.gaterRndTieOn = floatToBool(value);
  if (id === pk.gaterRndTieCover) sp.gaterRndTieCover = value;
  if (id === pk.gaterSeqPatterns_0)
    sp.gaterSeqPatterns[0] = value as GateSequencerCode;
  if (id === pk.gaterSeqPatterns_1)
    sp.gaterSeqPatterns[1] = value as GateSequencerCode;
  if (id === pk.gaterSeqPatterns_2)
    sp.gaterSeqPatterns[2] = value as GateSequencerCode;
  if (id === pk.gaterSeqPatterns_3)
    sp.gaterSeqPatterns[3] = value as GateSequencerCode;
  if (id === pk.exGaterSeqStride)
    sp.exGaterSeqStride = value as GaterExSourceStride;
  if (id === pk.exGaterCodes_0) sp.exGaterCodes[0] = value as ExGaterCode;
  if (id === pk.exGaterCodes_1) sp.exGaterCodes[1] = value as ExGaterCode;
  if (id === pk.exGaterCodes_2) sp.exGaterCodes[2] = value as ExGaterCode;
  if (id === pk.exGaterCodes_3) sp.exGaterCodes[3] = value as ExGaterCode;
  if (id === pk.kickOn) sp.kickOn = floatToBool(value);
  if (id === pk.kickPresetKey) sp.kickPresetKey = value as KickPresetKey;
  if (id === pk.bassOn) sp.bassOn = floatToBool(value);
  if (id === pk.bassDuty) sp.bassDuty = value;
  if (id === pk.bassPresetKey) sp.bassPresetKey = value as BassPresetKey;
  if (id === pk.bassTailAccentPatternKey)
    sp.bassTailAccentPatternKey = value as BassTailAccentPatternKey;
  if (id === pk.kickVolume) sp.kickVolume = value;
  if (id === pk.bassVolume) sp.bassVolume = value;
  if (id === pk.synthVolume) sp.synthVolume = value;
  if (id === pk.loopBars) sp.loopBars = value;
  if (id === pk.looped) sp.looped = floatToBool(value);
  if (id === pk.masterVolume) sp.masterVolume = value;
  if (id === pk.clockingOn) sp.clockingOn = floatToBool(value);
  if (id === pk.baseNoteIndex) sp.baseNoteIndex = value;
}
