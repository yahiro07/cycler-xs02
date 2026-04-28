class ControllerPivot: ControllerPivotProtocol {
  private let dspRouteAgent: DspRouteAgent
  private let parametersService: ParametersService
  private let storageFileIoService: StorageFileIoService
  private let stateKvsService: StateKvsService

  private var bridges: [WebViewBridgeProtocol] = []

  private var isStandalone: Bool = false

  init(
    dspRouteAgent: DspRouteAgent,
    parametersService: ParametersService,
    storageFileIoService: StorageFileIoService,
    stateKvsService: StateKvsService,
  ) {
    self.dspRouteAgent = dspRouteAgent
    self.parametersService = parametersService
    self.storageFileIoService = storageFileIoService
    self.stateKvsService = stateKvsService
  }

  func setStandaloneFlag() {
    if !self.isStandalone {
      self.isStandalone = true
      dspRouteAgent.pushCustomCommand(commandIds.setHostPlayState, 1)
      for bridge in bridges {
        bridge.sendCommandFromApp("setStandaloneFlag", 1)
        bridge.sendCommandFromApp("setHostPlayState", 1)
      }
    }
  }

  func addWebViewBridge(_ bridge: WebViewBridgeProtocol) {
    bridges.append(bridge)
  }
  func removeWebViewBridge(_ bridge: WebViewBridgeProtocol) {
    bridges.removeAll { $0 === bridge }
  }
  func uiLoaded(_ bridge: WebViewBridgeProtocol) {
    let parameters = parametersService.getAllParameterValues()
    bridge.bulkSendParameters(parameters)
    if self.isStandalone {
      bridge.sendCommandFromApp("setStandaloneFlag", 1)
      bridge.sendCommandFromApp("setHostPlayState", 1)
    }
  }

  func applyParameterEditFromUi(_ paramKey: String, _ value: Float, _ state: ParameterEditState) {
    if state == .Begin {
      parametersService.setParameterEditState(paramKey, true)
    } else if state == .Perform {
      parametersService.setParameterEditValue(paramKey, value)
    } else if state == .End {
      parametersService.setParameterEditState(paramKey, false)
    } else if state == .InstantChange {
      parametersService.setParameterEditState(paramKey, true)
      parametersService.setParameterEditValue(paramKey, value)
      parametersService.setParameterEditState(paramKey, false)
    }
  }
  func loadFullParametersSuit(_ parameters: [String: Float]) {
    parametersService.loadFullParametersSuit(parameters)
  }

  func requestNoteOn(_ noteNumber: Int, _ velocity: Float) {
    dspRouteAgent.pushInternalNote(noteNumber, velocity)
  }
  func requestNoteOff(_ noteNumber: Int) {
    dspRouteAgent.pushInternalNote(noteNumber, 0)
  }
  func applyCommandFromUi(_ commandKey: String, _ value: Float) {
    if commandKey == "setPlayState" {
      dspRouteAgent.pushCustomCommand(commandIds.setPlayState, value)
    } else if commandKey == "resetParameters" {
      var parameters = parametersService.getDefaultParameterValues()
      let excludingKeys = [
        "parametersVersion",
        "loopBars",
        "looped",
        "masterVolume",
        "clockingOn",
        "baseNoteIndex",
        "internalBpm",
        "autoRandomizeOnLoop",
        "randomizeLevel",
      ]
      for key in excludingKeys {
        parameters.removeValue(forKey: key)
      }
      loadFullParametersSuit(parameters)
    } else if commandKey == "randomizeParameters" {
      randomizeParameters()
    }
  }

  func randomizeParameters() {
    var parameters = parametersService.getAllParameterValues()
    applyParameterSuitOperationMapped(&parameters) { mapped in
      dspRouteAgent.extraLogic_randomizeParameters(&mapped)
    }
    loadFullParametersSuit(parameters)
  }

  func broadcastParameterChange(_ paramKey: String, _ value: Float) {
    for bridge in bridges {
      bridge.sendParameter(paramKey, value)
    }
  }

  func readFile(path: String, skipIfNotExist: Bool?) -> String? {
    return storageFileIoService.readFile(path: path, skipIfNotExist: skipIfNotExist)
  }

  func writeFile(path: String, content: String, append: Bool?) -> Bool {
    return storageFileIoService.writeFile(path: path, content: content, append: append)
  }

  func deleteFile(path: String) -> Bool {
    return storageFileIoService.deleteFile(path: path)
  }

  func getStateKvsItems() -> [String: String] {
    return stateKvsService.getItems()
  }

  func writeStateKvsItem(key: String, value: String) {
    stateKvsService.write(key, value)
  }

  func deleteStateKvsItem(key: String) {
    stateKvsService.delete(key)
  }

  func updateAutoParameterRandomization() {
    if dspRouteAgent.extraLogic_pullRandomizeRequestFlag() {
      randomizeParameters()
    }
  }

  func broadcastCommandToUi(_ commandKey: String, _ value: Float) {
    for bridge in bridges {
      bridge.sendCommandFromApp(commandKey, value)
    }
  }

  func broadcastHostNoteToUi(_ noteNumber: Int, _ isOn: Bool) {
    for bridge in bridges {
      bridge.sendHostNote(noteNumber, isOn)
    }
  }

  func drainHostEvents() {
    dspRouteAgent.drainHostEvents { event in
      switch event {
      case .hostNoteOn(let noteNumber):
        broadcastHostNoteToUi(noteNumber, true)
      case .hostNoteOff(let noteNumber):
        broadcastHostNoteToUi(noteNumber, false)
      case .hostTempo(let bpm):
        // logger.log("host bpm change: \(bpm)")
        if !isStandalone {
          //executed in host app
          //Host bpm --> DSP, UI
          parametersService.setInternalParameterFromHost(parameterIds.internalBpm, bpm)
        }
      case .hostPlayState(let playState):
        // logger.log("hostPalyState change: \(playState)")
        dspRouteAgent.pushCustomCommand(commandIds.setHostPlayState, playState ? 1 : 0)
        broadcastCommandToUi("setHostPlayState", playState ? 1 : 0)
      }
    }
  }
}

func applyParameterSuitOperationMapped(
  _ parameters: inout [String: Float], _ operationFn: (inout [UInt64: Float]) -> Void
) {
  var mapped: [UInt64: Float] = [:]
  for key in parameters.keys {
    let address = calcParameterIdHash(key)
    mapped[address] = parameters[key]
  }
  operationFn(&mapped)
  for key in parameters.keys {
    let address = calcParameterIdHash(key)
    parameters[key] = mapped[address]
  }
}
