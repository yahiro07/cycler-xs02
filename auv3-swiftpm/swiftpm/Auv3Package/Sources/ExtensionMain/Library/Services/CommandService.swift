class CommandEventPort {
  private var listeners: [Int: (_ key: String, _ value: Float) -> Void] = [:]
  private var nextListenerToken = 0
  func subscribe(_ listener: ((_ key: String, _ value: Float) -> Void)?) -> Int {
    let token = nextListenerToken
    nextListenerToken += 1
    listeners[token] = listener
    return token
  }

  func unsubscribe(_ token: Int) {
    listeners.removeValue(forKey: token)
  }

  func send(_ key: String, _ value: Float) {
    listeners.values.forEach { $0(key, value) }
  }
}

class CommandService {

  let portFromApp = CommandEventPort()

  func emitCommandFromApp(_ commandKey: String, _ value: Float) {
    portFromApp.send(commandKey, value)
  }
  func subscribeCommandFromApp(_ listener: ((_ key: String, _ value: Float) -> Void)?) -> Int {
    portFromApp.subscribe(listener)
  }

  func unsubscribeCommandFromApp(_ token: Int) {
    portFromApp.unsubscribe(token)
  }

  //
  let portFromUi = CommandEventPort()

  func emitCommandFromUi(_ commandKey: String, _ value: Float) {
    portFromUi.send(commandKey, value)
  }
  func subscribeCommandFromUi(_ listener: ((_ key: String, _ value: Float) -> Void)?) -> Int {
    portFromUi.subscribe(listener)
  }

  func unsubscribeCommandFromUi(_ token: Int) {
    portFromUi.unsubscribe(token)
  }
}
