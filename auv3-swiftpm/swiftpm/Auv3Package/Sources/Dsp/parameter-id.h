#pragma once
#include <cstdint>

constexpr uint64_t hash(const char *str) {
  uint64_t _hash = 0x811c9dc5;
  for (int i = 0; str[i] != '\0'; i++) {
    _hash ^= str[i];
    _hash = _hash * 0x01000193;
  }
  return _hash;
}

enum ParameterId : uint64_t {
  parametersVersion = hash("parametersVersion"),

  // osc
  oscOn = hash("oscOn"),
  oscWave = hash("oscWave"),
  oscOctave = hash("oscOctave"),
  oscPitch = hash("oscPitch"),
  oscPitchMode = hash("oscPitchMode"),
  oscPitchMoSmooth = hash("oscPitchMoSmooth"),
  oscColor = hash("oscColor"),
  oscColorMode = hash("oscColorMode"),
  oscUnisonMode = hash("oscUnisonMode"),
  oscUnisonDetune = hash("oscUnisonDetune"),

  // filter
  filterOn = hash("filterOn"),
  filterCutoff = hash("filterCutoff"),
  filterPeak = hash("filterPeak"),

  // amp
  ampOn = hash("ampOn"),
  ampEgHold = hash("ampEgHold"),
  ampEgDecay = hash("ampEgDecay"),

  // shaper
  shaperOn = hash("shaperOn"),
  shaperMode = hash("shaperMode"),
  shaperLevel = hash("shaperLevel"),

  // phaser
  phaserOn = hash("phaserOn"),
  phaserLevel = hash("phaserLevel"),

  // delay
  delayOn = hash("delayOn"),
  delayTime = hash("delayTime"),
  delayFeed = hash("delayFeed"),

  // stepDelay
  stepDelayOn = hash("stepDelayOn"),
  stepDelayStep = hash("stepDelayStep"),
  stepDelayFeed = hash("stepDelayFeed"),
  stepDelayMix = hash("stepDelayMix"),

  // motions= moOscPitch
  moOscPitch_moOn = hash("moOscPitch_moOn"),
  moOscPitch_moAmount = hash("moOscPitch_moAmount"),
  moOscPitch_moType = hash("moOscPitch_moType"),
  moOscPitch_rndStride = hash("moOscPitch_rndStride"),
  moOscPitch_rndMode = hash("moOscPitch_rndMode"),
  moOscPitch_rndCover = hash("moOscPitch_rndCover"),
  moOscPitch_lfoWave = hash("moOscPitch_lfoWave"),
  moOscPitch_lfoRate = hash("moOscPitch_lfoRate"),
  moOscPitch_lfoRateStepped = hash("moOscPitch_lfoRateStepped"),
  moOscPitch_lfoInvert = hash("moOscPitch_lfoInvert"),
  moOscPitch_egStride = hash("moOscPitch_egStride"),
  moOscPitch_egWave = hash("moOscPitch_egWave"),
  moOscPitch_egCurve = hash("moOscPitch_egCurve"),
  moOscPitch_egInvert = hash("moOscPitch_egInvert"),

  // motions= moOscColor
  moOscColor_moOn = hash("moOscColor_moOn"),
  moOscColor_moAmount = hash("moOscColor_moAmount"),
  moOscColor_moType = hash("moOscColor_moType"),
  moOscColor_rndStride = hash("moOscColor_rndStride"),
  moOscColor_rndMode = hash("moOscColor_rndMode"),
  moOscColor_rndCover = hash("moOscColor_rndCover"),
  moOscColor_lfoWave = hash("moOscColor_lfoWave"),
  moOscColor_lfoRate = hash("moOscColor_lfoRate"),
  moOscColor_lfoRateStepped = hash("moOscColor_lfoRateStepped"),
  moOscColor_lfoInvert = hash("moOscColor_lfoInvert"),
  moOscColor_egStride = hash("moOscColor_egStride"),
  moOscColor_egWave = hash("moOscColor_egWave"),
  moOscColor_egCurve = hash("moOscColor_egCurve"),
  moOscColor_egInvert = hash("moOscColor_egInvert"),

  // motions= moFilterCutoff
  moFilterCutoff_moOn = hash("moFilterCutoff_moOn"),
  moFilterCutoff_moAmount = hash("moFilterCutoff_moAmount"),
  moFilterCutoff_moType = hash("moFilterCutoff_moType"),
  moFilterCutoff_rndStride = hash("moFilterCutoff_rndStride"),
  moFilterCutoff_rndMode = hash("moFilterCutoff_rndMode"),
  moFilterCutoff_rndCover = hash("moFilterCutoff_rndCover"),
  moFilterCutoff_lfoWave = hash("moFilterCutoff_lfoWave"),
  moFilterCutoff_lfoRate = hash("moFilterCutoff_lfoRate"),
  moFilterCutoff_lfoRateStepped = hash("moFilterCutoff_lfoRateStepped"),
  moFilterCutoff_lfoInvert = hash("moFilterCutoff_lfoInvert"),
  moFilterCutoff_egStride = hash("moFilterCutoff_egStride"),
  moFilterCutoff_egWave = hash("moFilterCutoff_egWave"),
  moFilterCutoff_egCurve = hash("moFilterCutoff_egCurve"),
  moFilterCutoff_egInvert = hash("moFilterCutoff_egInvert"),

  // motions= moShaperLevel
  moShaperLevel_moOn = hash("moShaperLevel_moOn"),
  moShaperLevel_moAmount = hash("moShaperLevel_moAmount"),
  moShaperLevel_moType = hash("moShaperLevel_moType"),
  moShaperLevel_rndStride = hash("moShaperLevel_rndStride"),
  moShaperLevel_rndMode = hash("moShaperLevel_rndMode"),
  moShaperLevel_rndCover = hash("moShaperLevel_rndCover"),
  moShaperLevel_lfoWave = hash("moShaperLevel_lfoWave"),
  moShaperLevel_lfoRate = hash("moShaperLevel_lfoRate"),
  moShaperLevel_lfoRateStepped = hash("moShaperLevel_lfoRateStepped"),
  moShaperLevel_lfoInvert = hash("moShaperLevel_lfoInvert"),
  moShaperLevel_egStride = hash("moShaperLevel_egStride"),
  moShaperLevel_egWave = hash("moShaperLevel_egWave"),
  moShaperLevel_egCurve = hash("moShaperLevel_egCurve"),
  moShaperLevel_egInvert = hash("moShaperLevel_egInvert"),

  // motions= moPhaserLevel
  moPhaserLevel_moOn = hash("moPhaserLevel_moOn"),
  moPhaserLevel_moAmount = hash("moPhaserLevel_moAmount"),
  moPhaserLevel_moType = hash("moPhaserLevel_moType"),
  moPhaserLevel_rndStride = hash("moPhaserLevel_rndStride"),
  moPhaserLevel_rndMode = hash("moPhaserLevel_rndMode"),
  moPhaserLevel_rndCover = hash("moPhaserLevel_rndCover"),
  moPhaserLevel_lfoWave = hash("moPhaserLevel_lfoWave"),
  moPhaserLevel_lfoRate = hash("moPhaserLevel_lfoRate"),
  moPhaserLevel_lfoRateStepped = hash("moPhaserLevel_lfoRateStepped"),
  moPhaserLevel_lfoInvert = hash("moPhaserLevel_lfoInvert"),
  moPhaserLevel_egStride = hash("moPhaserLevel_egStride"),
  moPhaserLevel_egWave = hash("moPhaserLevel_egWave"),
  moPhaserLevel_egCurve = hash("moPhaserLevel_egCurve"),
  moPhaserLevel_egInvert = hash("moPhaserLevel_egInvert"),

  // motions= moDelayTime
  moDelayTime_moOn = hash("moDelayTime_moOn"),
  moDelayTime_moAmount = hash("moDelayTime_moAmount"),
  moDelayTime_moType = hash("moDelayTime_moType"),
  moDelayTime_rndStride = hash("moDelayTime_rndStride"),
  moDelayTime_rndMode = hash("moDelayTime_rndMode"),
  moDelayTime_rndCover = hash("moDelayTime_rndCover"),
  moDelayTime_lfoWave = hash("moDelayTime_lfoWave"),
  moDelayTime_lfoRate = hash("moDelayTime_lfoRate"),
  moDelayTime_lfoRateStepped = hash("moDelayTime_lfoRateStepped"),
  moDelayTime_lfoInvert = hash("moDelayTime_lfoInvert"),
  moDelayTime_egStride = hash("moDelayTime_egStride"),
  moDelayTime_egWave = hash("moDelayTime_egWave"),
  moDelayTime_egCurve = hash("moDelayTime_egCurve"),
  moDelayTime_egInvert = hash("moDelayTime_egInvert"),

  // gater
  gaterStride = hash("gaterStride"),
  gaterType = hash("gaterType"),
  gaterRndTieOn = hash("gaterRndTieOn"),
  gaterRndTieCover = hash("gaterRndTieCover"),
  exGaterSeqStride = hash("exGaterSeqStride"),
  gaterSeqPatterns_0 = hash("gaterSeqPatterns_0"),
  gaterSeqPatterns_1 = hash("gaterSeqPatterns_1"),
  gaterSeqPatterns_2 = hash("gaterSeqPatterns_2"),
  gaterSeqPatterns_3 = hash("gaterSeqPatterns_3"),
  exGaterCodes_0 = hash("exGaterCodes_0"),
  exGaterCodes_1 = hash("exGaterCodes_1"),
  exGaterCodes_2 = hash("exGaterCodes_2"),
  exGaterCodes_3 = hash("exGaterCodes_3"),

  // drums/bass
  kickOn = hash("kickOn"),
  kickPresetKey = hash("kickPresetKey"),
  bassOn = hash("bassOn"),
  bassDuty = hash("bassDuty"),
  bassPresetKey = hash("bassPresetKey"),
  bassTailAccentPatternKey = hash("bassTailAccentPatternKey"),

  // global
  kickVolume = hash("kickVolume"),
  bassVolume = hash("bassVolume"),
  synthVolume = hash("synthVolume"),
  loopBars = hash("loopBars"),
  looped = hash("looped"),
  masterVolume = hash("masterVolume"),
  clockingOn = hash("clockingOn"),
  baseNoteIndex = hash("baseNoteIndex"),

  // internal
  internalBpm = hash("internalBpm"),
  autoRandomizeOnLoop = hash("autoRandomizeOnLoop"),
  randomizeLevel = hash("randomizeLevel")
};

enum CommandId : uint64_t { setPlayState = hash("setPlayState") };