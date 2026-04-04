import SwiftUI

struct PluginMainView: View {
  // var parameterTree: ObservableAUParameterGroup

  // var body: some View {
  //   ParameterSlider(param: parameterTree.global.gain)
  // }
  let webViewBridge: WebViewBridge

  init(_ controllerFacade: ControllerFacadeProtocol) {
    self.webViewBridge = WebViewBridge(controllerFacade)
  }

  var body: some View {
    VStack {
      WebViewComponent { webViewIo in
        webViewIo.loadURL("http://localhost:3000?debug=1")
        // webViewIo.loadURL("app://www-bundles/index.html")
        // webViewHub.bindWebViewIo(webViewIo)
      }
    }
    .border(.green, width: 2)
    .ignoresSafeArea()
  }
}
