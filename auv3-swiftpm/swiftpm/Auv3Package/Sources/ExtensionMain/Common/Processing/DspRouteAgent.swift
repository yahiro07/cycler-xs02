import DspRoute

class DspRouteAgent {
  private let dspRoute: DspRouteEntry

  init(dspRoute: DspRouteEntry) {
    self.dspRoute = dspRoute
  }

  func pushInternalNote(_ noteNumber: Int, _ velocity: Float) {
    dspRoute.pushInternalNote(Int32(noteNumber), velocity)
  }

  func pushCustomCommand(_ commandId: UInt64, _ value: Float) {
    dspRoute.pushCustomCommand(commandId, value)
  }

  func pushParameterChange(_ address: UInt64, _ value: Float) {
    dspRoute.setParameter(address, value)
  }

  func extraLogic_pullRandomizeRequestFlag() -> Bool {
    return dspRoute.extraLogic_pullRandomizeRequestFlag()
  }

  func drainHostEvents(fn: (HostEvent) -> Void) {
    var rawEvent = DspRouteHostEvent()
    while dspRoute.popHostEvent(&rawEvent) {
      if let event = mapHostEventFromDspRouteHostEvent(rawEvent) {
        fn(event)
      }
    }
  }
}
