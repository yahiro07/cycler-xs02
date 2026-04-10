func calcParameterIdHash(_ str: String) -> UInt64 {
  var result: UInt64 = 0x811c_9dc5
  for byte in str.utf8 {
    result ^= UInt64(byte)
    result = result &* 0x0100_0193
  }
  return result
}
private let hash = calcParameterIdHash

struct ParameterIds {
  let parametersVersion = hash("parametersVersion")

  // osc
  let oscOn = hash("oscOn")
  let oscWave = hash("oscWave")
  let oscOctave = hash("oscOctave")
  let oscPitch = hash("oscPitch")
  let oscPitchMode = hash("oscPitchMode")
  let oscPitchMoSmooth = hash("oscPitchMoSmooth")
  let oscColor = hash("oscColor")
  let oscColorMode = hash("oscColorMode")
  let oscUnisonMode = hash("oscUnisonMode")
  let oscUnisonDetune = hash("oscUnisonDetune")

  // filter
  let filterOn = hash("filterOn")
  let filterCutoff = hash("filterCutoff")
  let filterPeak = hash("filterPeak")

  // amp
  let ampOn = hash("ampOn")
  let ampEgHold = hash("ampEgHold")
  let ampEgDecay = hash("ampEgDecay")

  // shaper
  let shaperOn = hash("shaperOn")
  let shaperMode = hash("shaperMode")
  let shaperLevel = hash("shaperLevel")

  // phaser
  let phaserOn = hash("phaserOn")
  let phaserLevel = hash("phaserLevel")

  // delay
  let delayOn = hash("delayOn")
  let delayTime = hash("delayTime")
  let delayFeed = hash("delayFeed")

  // stepDelay
  let stepDelayOn = hash("stepDelayOn")
  let stepDelayStep = hash("stepDelayStep")
  let stepDelayFeed = hash("stepDelayFeed")
  let stepDelayMix = hash("stepDelayMix")

  // motions= moOscPitch
  let moOscPitch_moOn = hash("moOscPitch_moOn")
  let moOscPitch_moAmount = hash("moOscPitch_moAmount")
  let moOscPitch_moType = hash("moOscPitch_moType")
  let moOscPitch_rndStride = hash("moOscPitch_rndStride")
  let moOscPitch_rndMode = hash("moOscPitch_rndMode")
  let moOscPitch_rndCover = hash("moOscPitch_rndCover")
  let moOscPitch_lfoWave = hash("moOscPitch_lfoWave")
  let moOscPitch_lfoRate = hash("moOscPitch_lfoRate")
  let moOscPitch_lfoRateStepped = hash("moOscPitch_lfoRateStepped")
  let moOscPitch_lfoInvert = hash("moOscPitch_lfoInvert")
  let moOscPitch_egStride = hash("moOscPitch_egStride")
  let moOscPitch_egWave = hash("moOscPitch_egWave")
  let moOscPitch_egCurve = hash("moOscPitch_egCurve")
  let moOscPitch_egInvert = hash("moOscPitch_egInvert")

  // motions= moOscColor
  let moOscColor_moOn = hash("moOscColor_moOn")
  let moOscColor_moAmount = hash("moOscColor_moAmount")
  let moOscColor_moType = hash("moOscColor_moType")
  let moOscColor_rndStride = hash("moOscColor_rndStride")
  let moOscColor_rndMode = hash("moOscColor_rndMode")
  let moOscColor_rndCover = hash("moOscColor_rndCover")
  let moOscColor_lfoWave = hash("moOscColor_lfoWave")
  let moOscColor_lfoRate = hash("moOscColor_lfoRate")
  let moOscColor_lfoRateStepped = hash("moOscColor_lfoRateStepped")
  let moOscColor_lfoInvert = hash("moOscColor_lfoInvert")
  let moOscColor_egStride = hash("moOscColor_egStride")
  let moOscColor_egWave = hash("moOscColor_egWave")
  let moOscColor_egCurve = hash("moOscColor_egCurve")
  let moOscColor_egInvert = hash("moOscColor_egInvert")

  // motions= moFilterCutoff
  let moFilterCutoff_moOn = hash("moFilterCutoff_moOn")
  let moFilterCutoff_moAmount = hash("moFilterCutoff_moAmount")
  let moFilterCutoff_moType = hash("moFilterCutoff_moType")
  let moFilterCutoff_rndStride = hash("moFilterCutoff_rndStride")
  let moFilterCutoff_rndMode = hash("moFilterCutoff_rndMode")
  let moFilterCutoff_rndCover = hash("moFilterCutoff_rndCover")
  let moFilterCutoff_lfoWave = hash("moFilterCutoff_lfoWave")
  let moFilterCutoff_lfoRate = hash("moFilterCutoff_lfoRate")
  let moFilterCutoff_lfoRateStepped = hash("moFilterCutoff_lfoRateStepped")
  let moFilterCutoff_lfoInvert = hash("moFilterCutoff_lfoInvert")
  let moFilterCutoff_egStride = hash("moFilterCutoff_egStride")
  let moFilterCutoff_egWave = hash("moFilterCutoff_egWave")
  let moFilterCutoff_egCurve = hash("moFilterCutoff_egCurve")
  let moFilterCutoff_egInvert = hash("moFilterCutoff_egInvert")

  // motions= moShaperLevel
  let moShaperLevel_moOn = hash("moShaperLevel_moOn")
  let moShaperLevel_moAmount = hash("moShaperLevel_moAmount")
  let moShaperLevel_moType = hash("moShaperLevel_moType")
  let moShaperLevel_rndStride = hash("moShaperLevel_rndStride")
  let moShaperLevel_rndMode = hash("moShaperLevel_rndMode")
  let moShaperLevel_rndCover = hash("moShaperLevel_rndCover")
  let moShaperLevel_lfoWave = hash("moShaperLevel_lfoWave")
  let moShaperLevel_lfoRate = hash("moShaperLevel_lfoRate")
  let moShaperLevel_lfoRateStepped = hash("moShaperLevel_lfoRateStepped")
  let moShaperLevel_lfoInvert = hash("moShaperLevel_lfoInvert")
  let moShaperLevel_egStride = hash("moShaperLevel_egStride")
  let moShaperLevel_egWave = hash("moShaperLevel_egWave")
  let moShaperLevel_egCurve = hash("moShaperLevel_egCurve")
  let moShaperLevel_egInvert = hash("moShaperLevel_egInvert")

  // motions= moPhaserLevel
  let moPhaserLevel_moOn = hash("moPhaserLevel_moOn")
  let moPhaserLevel_moAmount = hash("moPhaserLevel_moAmount")
  let moPhaserLevel_moType = hash("moPhaserLevel_moType")
  let moPhaserLevel_rndStride = hash("moPhaserLevel_rndStride")
  let moPhaserLevel_rndMode = hash("moPhaserLevel_rndMode")
  let moPhaserLevel_rndCover = hash("moPhaserLevel_rndCover")
  let moPhaserLevel_lfoWave = hash("moPhaserLevel_lfoWave")
  let moPhaserLevel_lfoRate = hash("moPhaserLevel_lfoRate")
  let moPhaserLevel_lfoRateStepped = hash("moPhaserLevel_lfoRateStepped")
  let moPhaserLevel_lfoInvert = hash("moPhaserLevel_lfoInvert")
  let moPhaserLevel_egStride = hash("moPhaserLevel_egStride")
  let moPhaserLevel_egWave = hash("moPhaserLevel_egWave")
  let moPhaserLevel_egCurve = hash("moPhaserLevel_egCurve")
  let moPhaserLevel_egInvert = hash("moPhaserLevel_egInvert")

  // motions= moDelayTime
  let moDelayTime_moOn = hash("moDelayTime_moOn")
  let moDelayTime_moAmount = hash("moDelayTime_moAmount")
  let moDelayTime_moType = hash("moDelayTime_moType")
  let moDelayTime_rndStride = hash("moDelayTime_rndStride")
  let moDelayTime_rndMode = hash("moDelayTime_rndMode")
  let moDelayTime_rndCover = hash("moDelayTime_rndCover")
  let moDelayTime_lfoWave = hash("moDelayTime_lfoWave")
  let moDelayTime_lfoRate = hash("moDelayTime_lfoRate")
  let moDelayTime_lfoRateStepped = hash("moDelayTime_lfoRateStepped")
  let moDelayTime_lfoInvert = hash("moDelayTime_lfoInvert")
  let moDelayTime_egStride = hash("moDelayTime_egStride")
  let moDelayTime_egWave = hash("moDelayTime_egWave")
  let moDelayTime_egCurve = hash("moDelayTime_egCurve")
  let moDelayTime_egInvert = hash("moDelayTime_egInvert")

  // gater
  let gaterStride = hash("gaterStride")
  let gaterType = hash("gaterType")
  let gaterRndTieOn = hash("gaterRndTieOn")
  let gaterRndTieCover = hash("gaterRndTieCover")
  let exGaterSeqStride = hash("exGaterSeqStride")
  let gaterSeqPatterns_0 = hash("gaterSeqPatterns_0")
  let gaterSeqPatterns_1 = hash("gaterSeqPatterns_1")
  let gaterSeqPatterns_2 = hash("gaterSeqPatterns_2")
  let gaterSeqPatterns_3 = hash("gaterSeqPatterns_3")
  let exGaterCodes_0 = hash("exGaterCodes_0")
  let exGaterCodes_1 = hash("exGaterCodes_1")
  let exGaterCodes_2 = hash("exGaterCodes_2")
  let exGaterCodes_3 = hash("exGaterCodes_3")

  // drums/bass
  let kickOn = hash("kickOn")
  let kickPresetKey = hash("kickPresetKey")
  let bassOn = hash("bassOn")
  let bassDuty = hash("bassDuty")
  let bassPresetKey = hash("bassPresetKey")
  let bassTailAccentPatternKey = hash("bassTailAccentPatternKey")

  // global
  let kickVolume = hash("kickVolume")
  let bassVolume = hash("bassVolume")
  let synthVolume = hash("synthVolume")
  let loopBars = hash("loopBars")
  let looped = hash("looped")
  let masterVolume = hash("masterVolume")
  let clockingOn = hash("clockingOn")
  let baseNoteIndex = hash("baseNoteIndex")

  // internal
  let internalBpm = hash("internalBpm")
  let autoRandomizeOnLoop = hash("autoRandomizeOnLoop")
  let randomizeLevel = hash("randomizeLevel")
}
let parameterIds = ParameterIds()

struct CommandIds {
  let setPlayState = hash("setPlayState")
}
let commandIds = CommandIds()
