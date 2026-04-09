private func hash(_ str: String) -> UInt64 {
  var result: UInt64 = 0x811c_9dc5
  for byte in str.utf8 {
    result ^= UInt64(byte)
    result = result &* 0x0100_0193
  }
  return result
}

struct ParameterIds {
  let parametersVersion = hash("parametersVersion")
  //
  let osc1On = hash("osc1On")
  let osc1Wave = hash("osc1Wave")
  let osc1Octave = hash("osc1Octave")
  let osc1PwMix = hash("osc1PwMix")
  let osc1Volume = hash("osc1Volume")
  //
  let osc2On = hash("osc2On")
  let osc2Wave = hash("osc2Wave")
  let osc2Octave = hash("osc2Octave")
  let osc2Detune = hash("osc2Detune")
  let osc2Volume = hash("osc2Volume")
  //
  let filterOn = hash("filterOn")
  let filterType = hash("filterType")
  let filterCutoff = hash("filterCutoff")
  let filterPeak = hash("filterPeak")
  let filterEnvMod = hash("filterEnvMod")
  //
  let ampOn = hash("ampOn")
  let ampAttack = hash("ampAttack")
  let ampDecay = hash("ampDecay")
  let ampSustain = hash("ampSustain")
  let ampRelease = hash("ampRelease")
  //
  let lfoOn = hash("lfoOn")
  let lfoWave = hash("lfoWave")
  let lfoRate = hash("lfoRate")
  let lfoDepth = hash("lfoDepth")
  let lfoTarget = hash("lfoTarget")
  //
  let egOn = hash("egOn")
  let egAttack = hash("egAttack")
  let egDecay = hash("egDecay")
  let egAmount = hash("egAmount")
  let egTarget = hash("egTarget")
  //
  let glide = hash("glide")
  let voicingMode = hash("voicingMode")
  let masterVolume = hash("masterVolume")
  //
  let internalBpm = hash("internalBpm")
  let autoRandomizeOnLoop = hash("autoRandomizeOnLoop")
  let randomizeLevel = hash("randomizeLevel")
}
let parameterIds = ParameterIds()

struct CommandIds {
  let setPlayState = hash("setPlayState")
}
let commandIds = CommandIds()
