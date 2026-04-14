import DspRoute

enum HostEvent {
  case hostNoteOn(Int)
  case hostNoteOff(Int)
  case hostTempo(Float)
  case hostPlayState(Bool)
}

func mapHostEventFromDspRouteHostEvent(_ e: DspRouteHostEvent) -> HostEvent? {
  switch e.type {
  case .none: return nil
  case .noteOn: return .hostNoteOn(Int(e.noteNumber))
  case .noteOff: return .hostNoteOff(Int(e.noteNumber))
  case .tempo: return .hostTempo(e.tempo)
  case .playState: return .hostPlayState(e.isPlaying)
  default: return nil
  }
}
