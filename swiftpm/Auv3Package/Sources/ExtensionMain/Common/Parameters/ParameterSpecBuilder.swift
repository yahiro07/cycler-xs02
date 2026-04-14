import AudioToolbox

let flagsDefault: AudioUnitParameterOptions = [
  .flag_IsReadable, .flag_IsWritable,
]
let flagsInternal: AudioUnitParameterOptions = [
  .flag_IsGlobalMeta, .flag_NonRealTime,
]

class ParameterSpecBuilder {
  let addressHashFn: (String) -> UInt64

  init(_ addressHashFn: @escaping (String) -> UInt64) {
    self.addressHashFn = addressHashFn
  }

  func Raw(
    address: UInt64,
    identifier: String,
    name: String,
    units: AudioUnitParameterUnit,
    valueRange: ClosedRange<AUValue>,
    defaultValue: AUValue,
    unitName: String? = nil,
    flags: AudioUnitParameterOptions = flagsDefault,
    valueStrings: [String]? = nil,
    dependentParameters: [NSNumber]? = nil
  ) -> ParameterSpec {
    return ParameterSpec(
      address: address,
      identifier: identifier,
      name: name,
      units: units,
      valueRange: valueRange,
      defaultValue: defaultValue,
      unitName: unitName,
      flags: flags,
      valueStrings: valueStrings,
      dependentParameters: dependentParameters
    )
  }
  func Linear(
    _ identifier: String, _ name: String, _ defaultValue: AUValue,
    _ minValue: AUValue, _ maxValue: AUValue, isInternal: Bool = false
  ) -> ParameterSpec {
    return ParameterSpec(
      address: addressHashFn(identifier),
      identifier: identifier,
      name: name,
      units: .generic,
      valueRange: minValue...maxValue,
      defaultValue: defaultValue,
      flags: isInternal ? flagsInternal : flagsDefault,
    )
  }
  func Unary(
    _ identifier: String, _ name: String, _ defaultValue: AUValue,
    isInternal: Bool = false
  ) -> ParameterSpec {
    return ParameterSpec(
      address: addressHashFn(identifier),
      identifier: identifier,
      name: name,
      units: .generic,
      valueRange: 0.0...1.0,
      defaultValue: defaultValue,
      flags: isInternal ? flagsInternal : flagsDefault,
    )
  }
  func Bool(
    _ identifier: String, _ name: String, _ defaultValue: Bool,
    isInternal: Bool = false
  ) -> ParameterSpec {
    return ParameterSpec(
      address: addressHashFn(identifier),
      identifier: identifier,
      name: name,
      units: .boolean,
      valueRange: 0.0...1.0,
      defaultValue: defaultValue ? 1.0 : 0.0,
      flags: isInternal ? flagsInternal : flagsDefault,
    )
  }
  func Enum(
    _ identifier: String, _ name: String, _ defaultIndex: Int,
    _ valueStrings: [String], isInternal: Bool = false
  ) -> ParameterSpec {
    return ParameterSpec(
      address: addressHashFn(identifier),
      identifier: identifier,
      name: name,
      units: .indexed,
      valueRange: 0.0...Float(valueStrings.count - 1),
      defaultValue: Float(defaultIndex),
      flags: isInternal
        ? [flagsInternal, .flag_ValuesHaveStrings]
        : [flagsDefault, .flag_ValuesHaveStrings],
      valueStrings: valueStrings
    )
  }
}
