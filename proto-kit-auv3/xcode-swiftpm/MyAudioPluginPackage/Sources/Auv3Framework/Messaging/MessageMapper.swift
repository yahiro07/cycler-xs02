import SwiftUI

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

private func toJson(_ dict: [String: Any]) -> String {
  let data = try! JSONSerialization.data(withJSONObject: dict as Any, options: [])
  return String(data: data, encoding: .utf8)!
}

func mapMessageFromApp_toJsonString(_ msg: MessageFromApp) -> String {
  switch msg {
  case .setParameter(let paramKey, let value):
    return toJson([
      "type": "setParameter",
      "paramKey": paramKey,
      "value": value,
    ])
  case .bulkSendParameters(let params):
    return toJson([
      "type": "bulkSendParameters",
      "params": params,
    ])
  }
}
