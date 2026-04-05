import Combine
import SwiftUI

enum MessageFromUI {
  case uiLoaded
  case beginEdit(_ paramKey: String)
  case endEdit(_ paramKey: String)
  case performEdit(_ paramKey: String, _ value: Float)
  case instantEdit(_ paramKey: String, _ value: Float)
  case noteOnRequest(_ noteNumber: Int)
  case noteOffRequest(_ noteNumber: Int)
}

func mapMessageFromUI_fromJsonString(_ jsonString: String) -> MessageFromUI? {
  let dict =
    try? JSONSerialization.jsonObject(with: jsonString.data(using: .utf8)!, options: [])
    as? [String: Any]
  guard let dict = dict else { return nil }
  guard let type = dict["type"] as? String else { return nil }
  switch type {
  case "uiLoaded":
    return .uiLoaded
  case "beginEdit":
    if let paramKey = dict["paramKey"] as? String {
      return .beginEdit(paramKey)
    }
  case "performEdit":
    if let paramKey = dict["paramKey"] as? String,
      let value = dict["value"] as? Double
    {
      return .performEdit(paramKey, Float(value))
    }
  case "endEdit":
    if let paramKey = dict["paramKey"] as? String {
      return .endEdit(paramKey)
    }
  case "instantEdit":
    if let paramKey = dict["paramKey"] as? String,
      let value = dict["value"] as? Double
    {
      return .instantEdit(paramKey, Float(value))
    }
  case "noteOnRequest":
    if let noteNumber = dict["noteNumber"] as? Int {
      return .noteOnRequest(noteNumber)
    }
  case "noteOffRequest":
    if let noteNumber = dict["noteNumber"] as? Int {
      return .noteOffRequest(noteNumber)
    }
  default:
    return nil
  }
  return nil
}

class WebViewBridge: ObservableObject {
  private let controllerFacade: ControllerFacadeProtocol
  private var webViewIo: WebViewIoProtocol?
  private var webViewIoSubscription: AnyCancellable?

  init(_ controllerFacade: ControllerFacadeProtocol) {
    self.controllerFacade = controllerFacade
  }

  private func handleMessageFromUI(msg: MessageFromUI) {
    logger.log("handleMessageFromUI: \(msg)")
    switch msg {
    case .uiLoaded:
      logger.log("ui loaded")
      //let allParameters = controllerFacade.getAllParameterValues()
      break
    case .beginEdit(let paramKey):
      controllerFacade.applyParameterEditFromUi(paramKey, 0, ParameterEditState.Begin)
    case .performEdit(let paramKey, let value):
      controllerFacade.applyParameterEditFromUi(paramKey, value, ParameterEditState.Perform)
    case .endEdit(let paramKey):
      controllerFacade.applyParameterEditFromUi(paramKey, 0, ParameterEditState.End)
    case .instantEdit(let paramKey, let value):
      controllerFacade.applyParameterEditFromUi(paramKey, value, ParameterEditState.InstantChange)
    case .noteOnRequest(let noteNumber):
      controllerFacade.requestNoteOn(noteNumber, 1.0)
    case .noteOffRequest(let noteNumber):
      controllerFacade.requestNoteOff(noteNumber)
    }
  }

  @MainActor
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
  }

  func unbindWebView() {
    logger.info("unbindWebView")
    webViewIoSubscription?.cancel()
    webViewIo = nil
  }
}
