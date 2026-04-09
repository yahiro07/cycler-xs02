import AudioToolbox
import Foundation

let oscWaveValues = ["Saw", "Rect", "Tri", "Sine", "Noise"]

let lfoDestinationValues = [
  "None", "Osc1Pitch", "Osc1PWMix", "Osc1Volume", "Osc2Pitch", "Osc2PWMix", "Osc2Volume",
  "FilterCutoff", "AmpVolume",
]

struct DefaultValues {
  static let osc1Wave = "Saw"
  static let osc1Volume: Float = 1
  //debug
  // static let osc1Wave = "Sine"
  // static let osc1Volume: Float = 0.1
}

func buildPluginParameterSpecs() -> ParameterTreeSpec {
  let pk = parameterIds
  let pb = ParameterSpecBuilder()
  return ParameterTreeSpec {
    ParameterGroupSpec(identifier: "global", name: "Global") {
      pb.Linear(
        pk.parametersVersion, "parametersVersion", "Parameters Version", 1, 0, 999999,
        isInternal: true,
      )
      pb.Bool(pk.osc1On, "osc1On", "OSC1 On", true)
      pb.Enum(pk.osc1Wave, "osc1Wave", "OSC1 Wave", DefaultValues.osc1Wave, oscWaveValues)
      pb.Unary(pk.osc1Octave, "osc1Octave", "OSC1 Octave", 0.5)
      pb.Unary(pk.osc1PwMix, "osc1PwMix", "OSC1 PwMix", 0.5)
      pb.Unary(pk.osc1Volume, "osc1Volume", "OSC1 Volume", DefaultValues.osc1Volume)
      //
      pb.Bool(pk.osc2On, "osc2On", "OSC2 On", false)
      pb.Enum(pk.osc2Wave, "osc2Wave", "OSC2 Wave", "Saw", oscWaveValues)
      pb.Unary(pk.osc2Octave, "osc2Octave", "OSC2 Octave", 0.5)
      pb.Unary(pk.osc2Detune, "osc2Detune", "OSC2 Detune", 0.5)
      pb.Unary(pk.osc2Volume, "osc2Volume", "OSC2 Volume", 0.5)
      //
      pb.Bool(pk.filterOn, "filterOn", "Filter On", true)
      pb.Enum(pk.filterType, "filterType", "Filter Type", "LPF", ["LPF", "BPF", "HPF"])
      pb.Unary(pk.filterCutoff, "filterCutoff", "Filter Cutoff", 1.0)
      pb.Unary(pk.filterPeak, "filterPeak", "Filter Peak", 0.0)
      pb.Unary(pk.filterEnvMod, "filterEnvMod", "Filter EnvMod", 0.5)
      //
      pb.Bool(pk.ampOn, "ampOn", "Amp On", true)
      pb.Unary(pk.ampAttack, "ampAttack", "Amp Attack", 0.0)
      pb.Unary(pk.ampDecay, "ampDecay", "Amp Decay", 0.0)
      pb.Unary(pk.ampSustain, "ampSustain", "Amp Sustain", 1.0)
      pb.Unary(pk.ampRelease, "ampRelease", "Amp Release", 0.0)
      //
      pb.Bool(pk.lfoOn, "lfoOn", "LFO On", false)
      pb.Enum(pk.lfoWave, "lfoWave", "LFO Wave", "Saw", oscWaveValues)
      pb.Unary(pk.lfoRate, "lfoRate", "LFO Rate", 0.5)
      pb.Unary(pk.lfoDepth, "lfoDepth", "LFO Depth", 0.5)
      pb.Enum(pk.lfoTarget, "lfoTarget", "LFO Target", "None", lfoDestinationValues)
      //
      pb.Bool(pk.egOn, "egOn", "EG On", false)
      pb.Unary(pk.egAttack, "egAttack", "EG Attack", 0.0)
      pb.Unary(pk.egDecay, "egDecay", "EG Decay", 0.0)
      pb.Unary(pk.egAmount, "egAmount", "EG Amount", 0.5)
      pb.Enum(pk.egTarget, "egTarget", "EG Target", "None", lfoDestinationValues)
      //
      pb.Unary(pk.glide, "glide", "glide", 0.0)
      pb.Enum(pk.voicingMode, "voicingMode", "Voicing Mode", "Mono", ["Mono", "Poly"])
      pb.Unary(pk.masterVolume, "masterVolume", "Master Volume", 0.8)
      //
      pb.Linear(
        pk.internalBpm, "internalBpm", "Internal BPM", 120, 30, 400, isInternal: true,
      )
      pb.Bool(
        pk.autoRandomizeOnLoop, "autoRandomizeOnLoop", "Auto Randomize On Loop", false,
        isInternal: true,
      )
      pb.Enum(
        pk.randomizeLevel, "randomizeLevel", "Randomize Level", "rnd1",
        ["rnd1", "rnd2", "rnd5", "rnd10", "rnd20", "rndFull"],
        isInternal: true,
      )
    }
  }
}

func migrateParametersIfNeeded(parameters: inout [String: Float]) {}
