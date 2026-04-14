#pragma once
#include "../base/parameter-defs.h"
#include "../base/parameter-id.h"
#include "../base/synthesis-bus.h"
#include "../motions/funcs/steps-common.h"
#include "../utils/math-utils.h"

namespace dsp {

inline bool floatToBool(float value) { return value > 0.5f; }

inline int floatToInt(float value) { return static_cast<int>(m_round(value)); }

template <typename T> inline T floatToEnum(float value) {
  return static_cast<T>(floatToInt(value));
}

inline void parameterAssigner_applyParameter(SynthesisBus &bus, uint64_t id,
                                             float value) {
  SynthParametersSuit &sp = bus.parameters;

  // Version and BPM
  if (id == ParameterId::parametersVersion)
    bus.paramVer = floatToInt(value);
  if (id == ParameterId::internalBpm)
    bus.bpm = value;
  if (id == ParameterId::loopBars)
    bus.loopBars = getLoopBarsFromKey(floatToEnum<LoopBarsKey>(value));

  // Oscillator
  if (id == ParameterId::oscOn)
    sp.oscOn = floatToBool(value);
  if (id == ParameterId::oscWave)
    sp.oscWave = floatToEnum<OscWave>(value);
  if (id == ParameterId::oscOctave)
    sp.oscOctave = floatToInt(value);
  if (id == ParameterId::oscPitch)
    sp.oscPitch = value;
  if (id == ParameterId::oscPitchMode)
    sp.oscPitchMode = floatToEnum<OscPitchMode>(value);
  if (id == ParameterId::oscPitchMoSmooth)
    sp.oscPitchMoSmooth = floatToBool(value);
  if (id == ParameterId::oscColor)
    sp.oscColor = value;
  if (id == ParameterId::oscColorMode)
    sp.oscColorMode = floatToEnum<OscColorMode>(value);
  if (id == ParameterId::oscUnisonMode)
    sp.oscUnisonMode = floatToEnum<OscUnisonMode>(value);
  if (id == ParameterId::oscUnisonDetune)
    sp.oscUnisonDetune = value;

  // Filter
  if (id == ParameterId::filterOn)
    sp.filterOn = floatToBool(value);
  if (id == ParameterId::filterCutoff)
    sp.filterCutoff = value;
  if (id == ParameterId::filterPeak)
    sp.filterPeak = value;

  // Amp
  if (id == ParameterId::ampOn)
    sp.ampOn = floatToBool(value);
  if (id == ParameterId::ampEgHold)
    sp.ampEgHold = value;
  if (id == ParameterId::ampEgDecay)
    sp.ampEgDecay = value;

  // Shaper
  if (id == ParameterId::shaperOn)
    sp.shaperOn = floatToBool(value);
  if (id == ParameterId::shaperMode)
    sp.shaperMode = floatToEnum<ShaperMode>(value);
  if (id == ParameterId::shaperLevel)
    sp.shaperLevel = value;

  // Phaser
  if (id == ParameterId::phaserOn)
    sp.phaserOn = floatToBool(value);
  if (id == ParameterId::phaserLevel)
    sp.phaserLevel = value;

  // Delay
  if (id == ParameterId::delayOn)
    sp.delayOn = floatToBool(value);
  if (id == ParameterId::delayTime)
    sp.delayTime = value;
  if (id == ParameterId::delayFeed)
    sp.delayFeed = value;

  // Step Delay
  if (id == ParameterId::stepDelayOn)
    sp.stepDelayOn = floatToBool(value);
  if (id == ParameterId::stepDelayStep)
    sp.stepDelayStep = floatToEnum<DelayStep>(value);
  if (id == ParameterId::stepDelayFeed)
    sp.stepDelayFeed = value;
  if (id == ParameterId::stepDelayMix)
    sp.stepDelayMix = value;

  // Motion: Osc Pitch
  if (id == ParameterId::moOscPitch_moOn)
    sp.moOscPitch.moOn = floatToBool(value);
  if (id == ParameterId::moOscPitch_moAmount)
    sp.moOscPitch.moAmount = value;
  if (id == ParameterId::moOscPitch_moType)
    sp.moOscPitch.moType = floatToEnum<MoType>(value);
  if (id == ParameterId::moOscPitch_rndStride)
    sp.moOscPitch.rndStride = floatToEnum<MotionStride>(value);
  if (id == ParameterId::moOscPitch_rndMode)
    sp.moOscPitch.rndMode = floatToEnum<MoRndMode>(value);
  if (id == ParameterId::moOscPitch_rndCover)
    sp.moOscPitch.rndCover = value;
  if (id == ParameterId::moOscPitch_lfoWave)
    sp.moOscPitch.lfoWave = floatToEnum<LfoWave>(value);
  if (id == ParameterId::moOscPitch_lfoRate)
    sp.moOscPitch.lfoRate = value;
  if (id == ParameterId::moOscPitch_lfoRateStepped)
    sp.moOscPitch.lfoRateStepped = floatToBool(value);
  if (id == ParameterId::moOscPitch_lfoInvert)
    sp.moOscPitch.lfoInvert = floatToBool(value);
  if (id == ParameterId::moOscPitch_egStride)
    sp.moOscPitch.egStride = floatToEnum<MotionStride>(value);
  if (id == ParameterId::moOscPitch_egWave)
    sp.moOscPitch.egWave = floatToEnum<MoEgWave>(value);
  if (id == ParameterId::moOscPitch_egCurve)
    sp.moOscPitch.egCurve = value;
  if (id == ParameterId::moOscPitch_egInvert)
    sp.moOscPitch.egInvert = floatToBool(value);

  // Motion: Osc Color
  if (id == ParameterId::moOscColor_moOn)
    sp.moOscColor.moOn = floatToBool(value);
  if (id == ParameterId::moOscColor_moAmount)
    sp.moOscColor.moAmount = value;
  if (id == ParameterId::moOscColor_moType)
    sp.moOscColor.moType = floatToEnum<MoType>(value);
  if (id == ParameterId::moOscColor_rndStride)
    sp.moOscColor.rndStride = floatToEnum<MotionStride>(value);
  if (id == ParameterId::moOscColor_rndMode)
    sp.moOscColor.rndMode = floatToEnum<MoRndMode>(value);
  if (id == ParameterId::moOscColor_rndCover)
    sp.moOscColor.rndCover = value;
  if (id == ParameterId::moOscColor_lfoWave)
    sp.moOscColor.lfoWave = floatToEnum<LfoWave>(value);
  if (id == ParameterId::moOscColor_lfoRate)
    sp.moOscColor.lfoRate = value;
  if (id == ParameterId::moOscColor_lfoRateStepped)
    sp.moOscColor.lfoRateStepped = floatToBool(value);
  if (id == ParameterId::moOscColor_lfoInvert)
    sp.moOscColor.lfoInvert = floatToBool(value);
  if (id == ParameterId::moOscColor_egStride)
    sp.moOscColor.egStride = floatToEnum<MotionStride>(value);
  if (id == ParameterId::moOscColor_egWave)
    sp.moOscColor.egWave = floatToEnum<MoEgWave>(value);
  if (id == ParameterId::moOscColor_egCurve)
    sp.moOscColor.egCurve = value;
  if (id == ParameterId::moOscColor_egInvert)
    sp.moOscColor.egInvert = floatToBool(value);

  // Motion: Filter Cutoff
  if (id == ParameterId::moFilterCutoff_moOn)
    sp.moFilterCutoff.moOn = floatToBool(value);
  if (id == ParameterId::moFilterCutoff_moAmount)
    sp.moFilterCutoff.moAmount = value;
  if (id == ParameterId::moFilterCutoff_moType)
    sp.moFilterCutoff.moType = floatToEnum<MoType>(value);
  if (id == ParameterId::moFilterCutoff_rndStride)
    sp.moFilterCutoff.rndStride = floatToEnum<MotionStride>(value);
  if (id == ParameterId::moFilterCutoff_rndMode)
    sp.moFilterCutoff.rndMode = floatToEnum<MoRndMode>(value);
  if (id == ParameterId::moFilterCutoff_rndCover)
    sp.moFilterCutoff.rndCover = value;
  if (id == ParameterId::moFilterCutoff_lfoWave)
    sp.moFilterCutoff.lfoWave = floatToEnum<LfoWave>(value);
  if (id == ParameterId::moFilterCutoff_lfoRate)
    sp.moFilterCutoff.lfoRate = value;
  if (id == ParameterId::moFilterCutoff_lfoRateStepped)
    sp.moFilterCutoff.lfoRateStepped = floatToBool(value);
  if (id == ParameterId::moFilterCutoff_lfoInvert)
    sp.moFilterCutoff.lfoInvert = floatToBool(value);
  if (id == ParameterId::moFilterCutoff_egStride)
    sp.moFilterCutoff.egStride = floatToEnum<MotionStride>(value);
  if (id == ParameterId::moFilterCutoff_egWave)
    sp.moFilterCutoff.egWave = floatToEnum<MoEgWave>(value);
  if (id == ParameterId::moFilterCutoff_egCurve)
    sp.moFilterCutoff.egCurve = value;
  if (id == ParameterId::moFilterCutoff_egInvert)
    sp.moFilterCutoff.egInvert = floatToBool(value);

  // Motion: Shaper Level
  if (id == ParameterId::moShaperLevel_moOn)
    sp.moShaperLevel.moOn = floatToBool(value);
  if (id == ParameterId::moShaperLevel_moAmount)
    sp.moShaperLevel.moAmount = value;
  if (id == ParameterId::moShaperLevel_moType)
    sp.moShaperLevel.moType = floatToEnum<MoType>(value);
  if (id == ParameterId::moShaperLevel_rndStride)
    sp.moShaperLevel.rndStride = floatToEnum<MotionStride>(value);
  if (id == ParameterId::moShaperLevel_rndMode)
    sp.moShaperLevel.rndMode = floatToEnum<MoRndMode>(value);
  if (id == ParameterId::moShaperLevel_rndCover)
    sp.moShaperLevel.rndCover = value;
  if (id == ParameterId::moShaperLevel_lfoWave)
    sp.moShaperLevel.lfoWave = floatToEnum<LfoWave>(value);
  if (id == ParameterId::moShaperLevel_lfoRate)
    sp.moShaperLevel.lfoRate = value;
  if (id == ParameterId::moShaperLevel_lfoRateStepped)
    sp.moShaperLevel.lfoRateStepped = floatToBool(value);
  if (id == ParameterId::moShaperLevel_lfoInvert)
    sp.moShaperLevel.lfoInvert = floatToBool(value);
  if (id == ParameterId::moShaperLevel_egStride)
    sp.moShaperLevel.egStride = floatToEnum<MotionStride>(value);
  if (id == ParameterId::moShaperLevel_egWave)
    sp.moShaperLevel.egWave = floatToEnum<MoEgWave>(value);
  if (id == ParameterId::moShaperLevel_egCurve)
    sp.moShaperLevel.egCurve = value;
  if (id == ParameterId::moShaperLevel_egInvert)
    sp.moShaperLevel.egInvert = floatToBool(value);

  // Motion: Phaser Level
  if (id == ParameterId::moPhaserLevel_moOn)
    sp.moPhaserLevel.moOn = floatToBool(value);
  if (id == ParameterId::moPhaserLevel_moAmount)
    sp.moPhaserLevel.moAmount = value;
  if (id == ParameterId::moPhaserLevel_moType)
    sp.moPhaserLevel.moType = floatToEnum<MoType>(value);
  if (id == ParameterId::moPhaserLevel_rndStride)
    sp.moPhaserLevel.rndStride = floatToEnum<MotionStride>(value);
  if (id == ParameterId::moPhaserLevel_rndMode)
    sp.moPhaserLevel.rndMode = floatToEnum<MoRndMode>(value);
  if (id == ParameterId::moPhaserLevel_rndCover)
    sp.moPhaserLevel.rndCover = value;
  if (id == ParameterId::moPhaserLevel_lfoWave)
    sp.moPhaserLevel.lfoWave = floatToEnum<LfoWave>(value);
  if (id == ParameterId::moPhaserLevel_lfoRate)
    sp.moPhaserLevel.lfoRate = value;
  if (id == ParameterId::moPhaserLevel_lfoRateStepped)
    sp.moPhaserLevel.lfoRateStepped = floatToBool(value);
  if (id == ParameterId::moPhaserLevel_lfoInvert)
    sp.moPhaserLevel.lfoInvert = floatToBool(value);
  if (id == ParameterId::moPhaserLevel_egStride)
    sp.moPhaserLevel.egStride = floatToEnum<MotionStride>(value);
  if (id == ParameterId::moPhaserLevel_egWave)
    sp.moPhaserLevel.egWave = floatToEnum<MoEgWave>(value);
  if (id == ParameterId::moPhaserLevel_egCurve)
    sp.moPhaserLevel.egCurve = value;
  if (id == ParameterId::moPhaserLevel_egInvert)
    sp.moPhaserLevel.egInvert = floatToBool(value);

  // Motion: Delay Time
  if (id == ParameterId::moDelayTime_moOn)
    sp.moDelayTime.moOn = floatToBool(value);
  if (id == ParameterId::moDelayTime_moAmount)
    sp.moDelayTime.moAmount = value;
  if (id == ParameterId::moDelayTime_moType)
    sp.moDelayTime.moType = floatToEnum<MoType>(value);
  if (id == ParameterId::moDelayTime_rndStride)
    sp.moDelayTime.rndStride = floatToEnum<MotionStride>(value);
  if (id == ParameterId::moDelayTime_rndMode)
    sp.moDelayTime.rndMode = floatToEnum<MoRndMode>(value);
  if (id == ParameterId::moDelayTime_rndCover)
    sp.moDelayTime.rndCover = value;
  if (id == ParameterId::moDelayTime_lfoWave)
    sp.moDelayTime.lfoWave = floatToEnum<LfoWave>(value);
  if (id == ParameterId::moDelayTime_lfoRate)
    sp.moDelayTime.lfoRate = value;
  if (id == ParameterId::moDelayTime_lfoRateStepped)
    sp.moDelayTime.lfoRateStepped = floatToBool(value);
  if (id == ParameterId::moDelayTime_lfoInvert)
    sp.moDelayTime.lfoInvert = floatToBool(value);
  if (id == ParameterId::moDelayTime_egStride)
    sp.moDelayTime.egStride = floatToEnum<MotionStride>(value);
  if (id == ParameterId::moDelayTime_egWave)
    sp.moDelayTime.egWave = floatToEnum<MoEgWave>(value);
  if (id == ParameterId::moDelayTime_egCurve)
    sp.moDelayTime.egCurve = value;
  if (id == ParameterId::moDelayTime_egInvert)
    sp.moDelayTime.egInvert = floatToBool(value);

  // Gater
  if (id == ParameterId::gaterStride)
    sp.gaterStride = floatToEnum<GaterSourceStride>(value);
  if (id == ParameterId::gaterType)
    sp.gaterType = floatToEnum<GaterType>(value);
  if (id == ParameterId::gaterRndTieOn)
    sp.gaterRndTieOn = floatToBool(value);
  if (id == ParameterId::gaterRndTieCover)
    sp.gaterRndTieCover = value;
  if (id == ParameterId::gaterSeqPatterns_0)
    sp.gaterSeqPatterns[0] = floatToEnum<GateSequencerCode>(value);
  if (id == ParameterId::gaterSeqPatterns_1)
    sp.gaterSeqPatterns[1] = floatToEnum<GateSequencerCode>(value);
  if (id == ParameterId::gaterSeqPatterns_2)
    sp.gaterSeqPatterns[2] = floatToEnum<GateSequencerCode>(value);
  if (id == ParameterId::gaterSeqPatterns_3)
    sp.gaterSeqPatterns[3] = floatToEnum<GateSequencerCode>(value);
  if (id == ParameterId::exGaterSeqStride)
    sp.exGaterSeqStride = floatToEnum<GaterExSourceStride>(value);
  if (id == ParameterId::exGaterCodes_0)
    sp.exGaterCodes[0] = floatToEnum<ExGaterCode>(value);
  if (id == ParameterId::exGaterCodes_1)
    sp.exGaterCodes[1] = floatToEnum<ExGaterCode>(value);
  if (id == ParameterId::exGaterCodes_2)
    sp.exGaterCodes[2] = floatToEnum<ExGaterCode>(value);
  if (id == ParameterId::exGaterCodes_3)
    sp.exGaterCodes[3] = floatToEnum<ExGaterCode>(value);

  // Kick / Bass
  if (id == ParameterId::kickOn)
    sp.kickOn = floatToBool(value);
  if (id == ParameterId::kickPresetKey)
    sp.kickPresetKey = floatToEnum<KickPresetKey>(value);
  if (id == ParameterId::bassOn)
    sp.bassOn = floatToBool(value);
  if (id == ParameterId::bassDuty)
    sp.bassDuty = value;
  if (id == ParameterId::bassPresetKey)
    sp.bassPresetKey = floatToEnum<BassPresetKey>(value);
  if (id == ParameterId::bassTailAccentPatternKey)
    sp.bassTailAccentPatternKey = floatToEnum<BassTailAccentPatternKey>(value);

  // Volumes
  if (id == ParameterId::kickVolume)
    sp.kickVolume = value;
  if (id == ParameterId::bassVolume)
    sp.bassVolume = value;
  if (id == ParameterId::synthVolume)
    sp.synthVolume = value;

  // Global
  if (id == ParameterId::looped)
    sp.looped = floatToBool(value);
  if (id == ParameterId::masterVolume)
    sp.masterVolume = value;
  if (id == ParameterId::clockingOn)
    sp.clockingOn = floatToBool(value);
  if (id == ParameterId::baseNoteIndex)
    sp.baseNoteIndex = floatToInt(value);
  if (id == ParameterId::autoRandomizeOnLoop)
    sp.autoRandomizeOnLoop = floatToBool(value);
  if (id == ParameterId::randomizeLevel)
    sp.randomizeLevel = floatToEnum<RandomizeLevel>(value);
}

} // namespace dsp
