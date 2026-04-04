import SwiftUI

struct Project1ExtensionMainView: View {
  var parameterTree: ObservableAUParameterGroup

  // var body: some View {
  //   ParameterSlider(param: parameterTree.global.gain)
  // }
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
