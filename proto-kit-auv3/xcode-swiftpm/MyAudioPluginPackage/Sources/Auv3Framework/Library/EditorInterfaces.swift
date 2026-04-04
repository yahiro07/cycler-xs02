import CoreAudioKit

protocol ControllerFacadeProtocol {
  func applyParameterEditFromUi(identifier: String, value: Float)
  func requestNoteOn(noteNumber: Int, velocity: Float)
  func requestNoteOff(noteNumber: Int)
}

class ControllerFacade: ControllerFacadeProtocol {
  let parameterTree: AUParameterTree
  let audioUnit: AUAudioUnit

  init(parameterTree: AUParameterTree, audioUnit: AUAudioUnit) {
    self.parameterTree = parameterTree
    self.audioUnit = audioUnit
  }

  func applyParameterEditFromUi(identifier: String, value: Float) {

  }
  func requestNoteOn(noteNumber: Int, velocity: Float) {

  }
  func requestNoteOff(noteNumber: Int) {

  }
}
