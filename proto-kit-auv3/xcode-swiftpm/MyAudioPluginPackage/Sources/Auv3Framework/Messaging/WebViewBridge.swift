import Combine
import SwiftUI

enum MessageFromUI {
  case uiLoaded
  case beginEdit(_ paramKey: String)
  case endEdit(_ paramKey: String)
  case performEdit(_ paramKey: String, _ value: Float)
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

class WebViewBridge {
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
      break
    case .beginEdit(let paramKey):
      break
    case .endEdit(let paramKey):
      break
    case .performEdit(let paramKey, let value):
      controllerFacade.applyParameterEditFromUi(paramKey, value)
    case .noteOnRequest(let noteNumber):
      controllerFacade.requestNoteOn(noteNumber, 1.0)
    case .noteOffRequest(let noteNumber):
      controllerFacade.requestNoteOff(noteNumber)
    }
  }

  @MainActor
  func bindWebViewIo(_ webViewIo: WebViewIoProtocol) {
    logger.info("bindWebViewIo")
    self.webViewIo = webViewIo

    webViewIoSubscription?.cancel()
    webViewIoSubscription = webViewIo.subscribeMessage { [weak self] message in
      if let msg: MessageFromUI = mapMessageFromUI_fromJsonString(message) {
        self?.handleMessageFromUI(msg: msg)
      } else {
        logger.warn("Unknown or invalid message from UI \(message)")
      }
    }
  }
}
