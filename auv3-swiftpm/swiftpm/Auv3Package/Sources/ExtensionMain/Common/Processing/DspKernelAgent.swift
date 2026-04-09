import DspRoute

class DspKernelAgent {
  private let dspKernel: UnsafeMutablePointer<PluginDSPKernel>

  init(dspKernel: UnsafeMutablePointer<PluginDSPKernel>) {
    self.dspKernel = dspKernel
  }

  func pushInternalNote(_ noteNumber: Int, _ velocity: Float) {
    dspKernel.pointee.pushInternalNote(Int32(noteNumber), velocity)
  }

  func pushCustomCommand(_ commandId: UInt64, _ value: Float) {
    dspKernel.pointee.pushCustomCommand(commandId, value)
  }

  func pushParameterChange(_ address: UInt64, _ value: Float) {
    dspKernel.pointee.setParameter(address, value)
  }

  func extraLogic_pullRandomizeRequestFlag() -> Bool {
    return dspKernel.pointee.extraLogic_pullRandomizeRequestFlag()
  }

  func drainHostEvents(fn: (HostEvent) -> Void) {
    var rawEvent = RtHostEvent()
    while dspKernel.pointee.popRtHostEvent(&rawEvent) {
      if let event = mapHostEventFromRtHostEvent(rawEvent) {
        fn(event)
      }
    }
  }
}
