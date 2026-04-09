import Combine
import SwiftUI

class WebViewBridge: NSObject, ObservableObject, WebViewBridgeProtocol {
  private let controllerPivot: ControllerPivotProtocol
  private var webViewIo: WebViewIoProtocol?
  private var webViewIoSubscription: AnyCancellable?

  init(_ controllerPivot: ControllerPivotProtocol) {
    self.controllerPivot = controllerPivot
    super.init()
  }

  @objc private func sendMessageOnMainThread(_ message: NSString) {
    webViewIo?.sendMessage(message as String)
  }

  private func sendMessageToUI(_ message: String) {
    if Thread.isMainThread {
      webViewIo?.sendMessage(message)
      return
    }
    performSelector(
      onMainThread: #selector(sendMessageOnMainThread(_:)),
      with: message as NSString,
      waitUntilDone: false)
  }

  func sendParameter(_ paramKey: String, _ value: Float) {
    let json = mapMessageFromApp_toJsonString(.setParameter(paramKey: paramKey, value: value))
    sendMessageToUI(json)
  }

  func bulkSendParameters(_ parameters: [String: Float]) {
    let json = mapMessageFromApp_toJsonString(.bulkSendParameters(parameters: parameters))
    sendMessageToUI(json)
  }

  func sendHostEvent(_ event: HostEvent) {
    let msg = mapHostEventToMessage(event)
    let json = mapMessageFromApp_toJsonString(msg)
    sendMessageToUI(json)
  }

  func sendCommandFromApp(_ commandKey: String, _ value: Float) {
    let json = mapMessageFromApp_toJsonString(
      .applyCommand(commandKey: commandKey, value: value))
    sendMessageToUI(json)
  }

  private func handleMessageFromUI(msg: MessageFromUI) {
    // logger.log("handleMessageFromUI: \(msg)")
    switch msg {
    case .log(let timestamp, let logKind, let message):
      logger.pushLogItem(
        LogItem(timestamp: timestamp, subsystem: "ui", logKind: logKind, message: message))
    case .uiLoaded:
      logger.log("ui loaded")
      controllerPivot.uiLoaded(self)
    case .beginEdit(let paramKey):
      controllerPivot.applyParameterEditFromUi(paramKey, 0, ParameterEditState.Begin)
    case .performEdit(let paramKey, let value):
      controllerPivot.applyParameterEditFromUi(paramKey, value, ParameterEditState.Perform)
    case .endEdit(let paramKey):
      controllerPivot.applyParameterEditFromUi(paramKey, 0, ParameterEditState.End)
    case .instantEdit(let paramKey, let value):
      controllerPivot.applyParameterEditFromUi(paramKey, value, ParameterEditState.InstantChange)
    case .noteOnRequest(let noteNumber):
      controllerPivot.requestNoteOn(noteNumber, 1.0)
    case .noteOffRequest(let noteNumber):
      controllerPivot.requestNoteOff(noteNumber)
    case .applyCommand(let commandKey, let value):
      controllerPivot.applyCommandFromUi(commandKey, value)
    case .loadFullParameters(let parameters):
      controllerPivot.loadFullParametersSuit(parameters)
    case .rpcReadFileRequest(let rpcId, let path, let skipIfNotExists):
      let content = controllerPivot.readFile(path: path, skipIfNotExist: skipIfNotExists)
      let msg = mapMessageFromApp_toJsonString(
        .rpcReadFileResponse(rpcId: rpcId, success: content != nil, content: content ?? ""))
      sendMessageToUI(msg)
    case .rpcWriteFileRequest(let rpcId, let path, let content, let append):
      let success = controllerPivot.writeFile(path: path, content: content, append: append)
      let msg = mapMessageFromApp_toJsonString(
        .rpcWriteFileResponse(rpcId: rpcId, success: success))
      sendMessageToUI(msg)
    case .rpcDeleteFileRequest(let rpcId, let path):
      let success = controllerPivot.deleteFile(path: path)
      let msg = mapMessageFromApp_toJsonString(
        .rpcDeleteFileResponse(rpcId: rpcId, success: success))
      sendMessageToUI(msg)
    case .rpcLoadStateKvsItemsRequest(let rpcId):
      let items = controllerPivot.getStateKvsItems()
      let msg = mapMessageFromApp_toJsonString(
        .rpcLoadStateKvsItemsResponse(rpcId: rpcId, items: items))
      sendMessageToUI(msg)
    case .writeStateKvsItem(let key, let value):
      controllerPivot.writeStateKvsItem(key: key, value: value)
    case .deleteStateKvsItem(let key):
      controllerPivot.deleteStateKvsItem(key: key)
    }
  }

  func bindWebView(_ webViewIo: WebViewIoProtocol) {
    logger.info("bindWebView")
    self.webViewIo = webViewIo
    webViewIoSubscription = webViewIo.subscribeMessage { [weak self] message in
      if let msg: MessageFromUI = mapMessageFromUI_fromJsonString(message) {
        self?.handleMessageFromUI(msg: msg)
      } else {
        logger.warn("Unknown or invalid message from UI \(message)")
      }
    }
    controllerPivot.addWebViewBridge(self)
  }

  func unbindWebView() {
    logger.info("unbindWebView")
    controllerPivot.removeWebViewBridge(self)
    if webViewIo != nil {
      webViewIoSubscription?.cancel()
      webViewIo = nil
    }
  }
}
