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
      for bridge in bridges {
        bridge.sendCommandFromApp("setStandaloneFlag", 1)
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
    if commandKey == "randomizeParameters" {
      parametersService.randomizeParameters()
    } else if commandKey == "setPlayState" {
      dspRouteAgent.pushCustomCommand(commandIds.setPlayState, value)
    }
  }

  func broadcastParameterChange(_ paramKey: String, _ value: Float) {
    for bridge in bridges {
      bridge.sendParameter(paramKey, value)
    }
  }

  func broadcastHostEvent(_ event: HostEvent) {
    for bridge in bridges {
      bridge.sendHostEvent(event)
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

}
