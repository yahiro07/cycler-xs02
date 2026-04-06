import SwiftUI

struct Project1ExtensionMainView: View {
  var parameterTree: ObservableAUParameterGroup

  var body: some View {
    ParameterSlider(param: parameterTree.global.gain)
  }
}
