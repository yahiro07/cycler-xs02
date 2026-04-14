import AudioToolbox
import Foundation

let oscWaveLabels = ["saw", "rect", "tri", "sine"]
let lfoWaveLabels = ["sine", "rect", "tri", "saw"]
let delayStepLabels = ["/16", "/8", "/4"]
let oscPitchModeLabels = ["liner", "octave", "oct-x", "ratio", "semi", "map1", "map2", "map3"]
let gaterStrideLabels = ["/16", "/8", "/4", "/2", "1", "2", "4", "gate"]
let motionStrideLabels = ["/16", "/8", "/4", "/2", "1", "2", "4", "gate", "ex"]
let gaterSourceStrideLabels = ["/16", "/8", "/4"]
let gaterExSourceStrideLabels = ["/16", "/8", "/4", "/2", "1"]
let gaterTypeLabels = ["seq", "lax"]
let gateSequencerCodeLabels = ["oooo", "ooo>", "oo>o", "o>oo", ">ooo", ">oo>"]
let gateSequencerCodeLabelsForHead = ["oooo", "ooo>", "oo>o", "o>oo"]
let moEgWaveLabels = ["d", "d2", "ad", "bump", "duty", "stair"]
let exGaterCodeLabels = ["o", "-", "oo", ">"]
let exGaterCodeLabelsForHead = ["o", "-", "oo"]
let rndModeLabels = ["sh", "sd", "sg"]
let oscColorModeLabels = ["sfm", "speed", "accel", "drill", "sdm", "creep", "sinus", "ridge"]
let shaperModeLabels = ["ws1", "ws2", "ws3", "ws4", "ws5"]
let oscUnisonModeLabels = ["one", "det2", "det3", "sub", "fifth"]
let moTypeLabels = ["lfo", "eg", "rnd"]
let kickPresetKeyLabels = ["kick1", "kick2", "kick3", "kick4", "kick5"]
let bassPresetKeyLabels = ["bass1", "bass2", "bass3", "bass4"]
let bassTailAccentPatternKeyLabels = ["off", "pattern1", "pattern2", "pattern3", "pattern4"]
let loopBarsLabels = ["1", "2", "4"]
let randomizeLevelLabels = ["rnd1", "rnd2", "rnd5", "rnd10", "rnd20", "rndFull"]

func addMotionParameterSpecs(
  _ pB: ParameterSpecBuilder, _ mo: String, _ baseLabel: String, _ moTypeDefault: Int
) -> [ParameterSpec] {
  return [
    pB.Bool("\(mo)_moOn", "MO \(baseLabel) On", false),
    pB.Enum("\(mo)_moType", "MO \(baseLabel) Type", moTypeDefault, moTypeLabels),
    pB.Unary("\(mo)_moAmount", "MO \(baseLabel) Amount", 0.5),
    pB.Enum("\(mo)_rndStride", "MO \(baseLabel) RND Stride", 7, motionStrideLabels),
    pB.Enum("\(mo)_rndMode", "MO \(baseLabel) RND Mode", 0, rndModeLabels),
    pB.Unary("\(mo)_rndCover", "MO \(baseLabel) RND Cover", 1),
    pB.Enum("\(mo)_lfoWave", "MO \(baseLabel) LFO Wave", 0, lfoWaveLabels),
    pB.Unary("\(mo)_lfoRate", "MO \(baseLabel) LFO Rate", 0.5),
    pB.Bool("\(mo)_lfoRateStepped", "MO \(baseLabel) LFO Rate Stepped", false),
    pB.Bool("\(mo)_lfoInvert", "MO \(baseLabel) LFO Invert", false),
    pB.Enum("\(mo)_egStride", "MO \(baseLabel) EG Stride", 7, motionStrideLabels),
    pB.Enum("\(mo)_egWave", "MO \(baseLabel) EG Wave", 0, moEgWaveLabels),
    pB.Unary("\(mo)_egCurve", "MO \(baseLabel) EG Curve", 0.5),
    pB.Bool("\(mo)_egInvert", "MO \(baseLabel) EG Invert", false),
  ]
}

func buildPluginParameterSpecs() -> ParameterTreeSpec {
  let pb = ParameterSpecBuilder(calcParameterIdHash)
  return ParameterTreeSpec {
    ParameterGroupSpec(identifier: "osc", name: "OSC") {
      pb.Bool("oscOn", "OSC On", true)
      pb.Enum("oscWave", "OSC Wave", 0, oscWaveLabels)
      pb.Unary("oscOctave", "OSC Octave", 0)
      pb.Unary("oscPitch", "OSC Pitch", 0.5)
      pb.Enum("oscPitchMode", "OSC Pitch Mode", 1, oscPitchModeLabels)
      pb.Unary("oscPitchMoSmooth", "OSC Pitch MoSmooth", 0)
      pb.Unary("oscColor", "OSC Color", 0)
      pb.Enum("oscColorMode", "OSC Color Mode", 0, oscColorModeLabels)
      pb.Enum("oscUnisonMode", "OSC Unison Mode", 0, oscUnisonModeLabels)
      pb.Unary("oscUnisonDetune", "OSC Unison Detune", 0)
    }
    ParameterGroupSpec(identifier: "filter", name: "Filter") {
      pb.Bool("filterOn", "Filter On", true)
      pb.Unary("filterCutoff", "Filter Cutoff", 1)
      pb.Unary("filterPeak", "Filter Peak", 0)
    }
    ParameterGroupSpec(identifier: "amp", name: "Amp") {
      pb.Bool("ampOn", "Amp On", true)
      pb.Unary("ampEgHold", "Amp Eg Hold", 0.8)
      pb.Unary("ampEgDecay", "Amp Eg Decay", 0)
    }
    ParameterGroupSpec(identifier: "shaper", name: "Shaper") {
      pb.Bool("shaperOn", "Shaper On", false)
      pb.Enum("shaperMode", "Shaper Mode", 0, shaperModeLabels)
      pb.Unary("shaperLevel", "Shaper Level", 0.5)
    }
    ParameterGroupSpec(identifier: "phaser", name: "Phaser") {
      pb.Bool("phaserOn", "Phaser On", false)
      pb.Unary("phaserLevel", "Phaser Level", 0.5)
    }
    ParameterGroupSpec(identifier: "flanger", name: "Flanger") {
      pb.Bool("delayOn", "Flanger On", false)
      pb.Unary("delayTime", "Flanger Time", 0.5)
      pb.Unary("delayFeed", "Flanger Feed", 0.3)
    }
    ParameterGroupSpec(identifier: "delay", name: "Delay") {
      pb.Bool("stepDelayOn", "Delay On", false)
      pb.Enum("stepDelayStep", "Delay Step", 1, delayStepLabels)
      pb.Unary("stepDelayFeed", "Delay Feed", 0.5)
      pb.Unary("stepDelayMix", "Delay Mix", 0.5)
    }
    ParameterGroupSpec(identifier: "gater", name: "Gate") {
      pb.Enum("gaterStride", "Gate Stride", 0, gaterStrideLabels)
      pb.Enum("gaterType", "Gate Type", 0, gaterTypeLabels)
      pb.Bool("gaterRndTieOn", "Gate Rnd Tie On", false)
      pb.Unary("gaterRndTieCover", "Gate Rnd Tie Cover", 0.5)
      pb.Enum(
        "gaterSeqPatterns_0", "Gater Seq Patterns 0", 0,
        gateSequencerCodeLabels)
      pb.Enum(
        "gaterSeqPatterns_1", "Gater Seq Patterns 1", 0,
        gateSequencerCodeLabels)
      pb.Enum(
        "gaterSeqPatterns_2", "Gater Seq Patterns 2", 0,
        gateSequencerCodeLabels)
      pb.Enum(
        "gaterSeqPatterns_3", "Gater Seq Patterns 3", 0,
        gateSequencerCodeLabels)
    }
    ParameterGroupSpec(identifier: "exGater", name: "Ex Steps") {
      pb.Enum(
        "exGaterSeqStride", "Ex Steps Stride", 0,
        gaterExSourceStrideLabels)
      pb.Enum("exGaterCodes_0", "Ex Steps Codes 0", 0, exGaterCodeLabels)
      pb.Enum("exGaterCodes_1", "Ex Steps Codes 1", 0, exGaterCodeLabels)
      pb.Enum("exGaterCodes_2", "Ex Steps Codes 2", 0, exGaterCodeLabels)
      pb.Enum("exGaterCodes_3", "Ex Steps Codes 3", 0, exGaterCodeLabels)
    }
    ParameterGroupSpec(identifier: "kick", name: "Kick") {
      pb.Bool("kickOn", "Kick On", true)
      pb.Enum("kickPresetKey", "Kick Preset Key", 0, kickPresetKeyLabels)
    }
    ParameterGroupSpec(identifier: "bass", name: "Bass") {
      pb.Bool("bassOn", "Bass On", true)
      pb.Unary("bassDuty", "Bass Duty", 0.6)
      pb.Enum("bassPresetKey", "Bass Preset Key", 0, bassPresetKeyLabels)
      pb.Enum(
        "bassTailAccentPatternKey", "Bass Tail Accent Pattern Key",
        0, bassTailAccentPatternKeyLabels)
    }
    ParameterGroupSpec(identifier: "loop", name: "Loop") {
      pb.Enum("loopBars", "Loop Bars", 1, loopBarsLabels)
      pb.Bool("looped", "Looped", false)
      pb.Bool("clockingOn", "Clocking On", true)
      pb.Unary("baseNoteIndex", "Base Note Index", 9)  //A
    }
    ParameterGroupSpec(identifier: "mixer", name: "Mixer") {
      pb.Unary("kickVolume", "Kick Volume", 1)
      pb.Unary("bassVolume", "Bass Volume", 1)
      pb.Unary("synthVolume", "Synth Volume", 1)
      pb.Unary("masterVolume", "Master Volume", 0.5)
    }
    ParameterGroupSpec(identifier: "moOscPitch", name: "MO OSC Pitch") {
      addMotionParameterSpecs(pb, "moOscPitch", "OSC Pitch", 0)
    }
    ParameterGroupSpec(identifier: "moOscColor", name: "MO OSC Color") {
      addMotionParameterSpecs(pb, "moOscColor", "OSC Color", 1)
    }
    ParameterGroupSpec(identifier: "moFilterCutoff", name: "MO Filter Cutoff") {
      addMotionParameterSpecs(pb, "moFilterCutoff", "Filter Cutoff", 2)
    }
    ParameterGroupSpec(identifier: "moShaperLevel", name: "MO Shaper Level") {
      addMotionParameterSpecs(pb, "moShaperLevel", "Shaper Level", 0)
    }
    ParameterGroupSpec(identifier: "moPhaserLevel", name: "MO Phaser Level") {
      addMotionParameterSpecs(pb, "moPhaserLevel", "Phaser Level", 1)
    }
    ParameterGroupSpec(identifier: "moDelayTime", name: "MO Delay Time") {
      addMotionParameterSpecs(pb, "moDelayTime", "Delay Time", 2)
    }
    ParameterGroupSpec(identifier: "internal", name: "Internal") {
      pb.Linear(
        "internalBpm", "Internal BPM", 130, 30, 400, isInternal: true,
      )
      pb.Bool(
        "autoRandomizeOnLoop", "Auto Randomize On Loop", false,
        isInternal: true,
      )
      pb.Enum(
        "randomizeLevel", "Randomize Level", 3, randomizeLevelLabels,
        isInternal: true,
      )
      pb.Linear(
        "parametersVersion", "Parameters Version", 1, 0, 999999,
        isInternal: true,
      )
    }

  }
}

func migrateParametersIfNeeded(parameters: inout [String: Float]) {}
