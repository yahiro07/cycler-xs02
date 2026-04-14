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
  //define fields only for parameters referenced in swift side
  let internalBpm = hash("internalBpm")
  let autoRandomizeOnLoop = hash("autoRandomizeOnLoop")
  let randomizeLevel = hash("randomizeLevel")
}
let parameterIds = ParameterIds()

struct CommandIds {
  let setPlayState = hash("setPlayState")
}
let commandIds = CommandIds()
