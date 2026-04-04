import AudioToolbox
import Foundation

let Project1ExtensionParameterSpecs = ParameterTreeSpec {
  ParameterGroupSpec(identifier: "global", name: "Global") {
    ParameterSpec(
      address: 0,
      identifier: "parametersVersion",
      name: "Parameters Version",
      units: .generic,
      valueRange: 0...999999,
      defaultValue: 1,
      flags: [AudioUnitParameterOptions.flag_IsGlobalMeta]
    )
    ParameterSpec(
      address: 1,
      identifier: "oscEnabled",
      name: "Osc Enabled",
      units: .boolean,
      valueRange: 0...1,
      defaultValue: 1,
      flags: []
    )
    ParameterSpec(
      address: 2,
      identifier: "oscWave",
      name: "Osc Wave",
      units: .generic,
      valueRange: 0...3,
      defaultValue: 0,
      flags: []
    )
    ParameterSpec(
      address: 3,
      identifier: "oscPitch",
      name: "Osc Pitch",
      units: .generic,
      valueRange: 0...1,
      defaultValue: 0.5,
      flags: []
    )
    ParameterSpec(
      address: 4,
      identifier: "oscVolume",
      name: "Osc Volume",
      units: .generic,
      valueRange: 0...1,
      defaultValue: 0.5,
      flags: []
    )
  }
}
