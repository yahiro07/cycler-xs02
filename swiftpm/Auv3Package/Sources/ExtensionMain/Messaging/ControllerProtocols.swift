enum ParameterEditState: Int {
  case Begin = 0
  case Perform
  case End
  case InstantChange
}

protocol ControllerPivotProtocol {
  func addWebViewBridge(_ bridge: WebViewBridgeProtocol)
  func removeWebViewBridge(_ bridge: WebViewBridgeProtocol)
  func uiLoaded(_ bridge: WebViewBridgeProtocol)

  func applyParameterEditFromUi(_ paramKey: String, _ value: Float, _ state: ParameterEditState)
  func loadFullParametersSuit(_ parameters: [String: Float])
  func requestNoteOn(_ noteNumber: Int, _ velocity: Float)
  func requestNoteOff(_ noteNumber: Int)
  func applyCommandFromUi(_ commandKey: String, _ value: Float)

  func readFile(path: String, skipIfNotExist: Bool?) -> String?
  func writeFile(path: String, content: String, append: Bool?) -> Bool
  func deleteFile(path: String) -> Bool
  func getStateKvsItems() -> [String: String]
  func writeStateKvsItem(key: String, value: String)
  func deleteStateKvsItem(key: String)
}

protocol WebViewBridgeProtocol: AnyObject {
  func sendParameter(_ paramKey: String, _ value: Float)
  func bulkSendParameters(_ parameters: [String: Float])
  func sendHostNote(_ noteNumber: Int, _ isOn: Bool)
  func sendCommandFromApp(_ commandKey: String, _ value: Float)
}
