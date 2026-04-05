import CoreAudioKit

protocol ControllerFacadeProtocol {
  func applyParameterEditFromUi(_ identifier: String, _ value: Float)
  func requestNoteOn(_ noteNumber: Int, _ velocity: Float)
  func requestNoteOff(_ noteNumber: Int)
}

class ControllerFacade: ControllerFacadeProtocol {
  let parameterTree: AUParameterTree
  let audioUnit: AUAudioUnit

  init(parameterTree: AUParameterTree, audioUnit: AUAudioUnit) {
    self.parameterTree = parameterTree
    self.audioUnit = audioUnit
  }

  func applyParameterEditFromUi(_ identifier: String, _ value: Float) {
    guard let parameter = parameterTree.allParameters.first(where: { $0.identifier == identifier })
    else {
      print("Parameter not found for: (identifier)")
      return
    }
    parameter.setValue(value, originator: nil)
  }
  func requestNoteOn(_ noteNumber: Int, _ velocity: Float) {
    let bytes: [UInt8] = [0x90, UInt8(noteNumber), UInt8(velocity * 127)]
    audioUnit.scheduleMIDIEventBlock?(AUEventSampleTimeImmediate, 0, 3, bytes)
  }
  func requestNoteOff(_ noteNumber: Int) {
    let bytes: [UInt8] = [0x80, UInt8(noteNumber), 0]
    audioUnit.scheduleMIDIEventBlock?(AUEventSampleTimeImmediate, 0, 3, bytes)
  }
}
