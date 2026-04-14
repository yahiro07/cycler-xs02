import Combine
import CoreAudioKit
import SwiftUI
import os

open class PluginAudioUnitViewController: AUViewController, AUAudioUnitFactory {
  var audioUnit: PluginAudioUnit?
  let hostingControllerWrapper = HostingControllerWrapper()

  // private var observation: NSKeyValueObservation?

  /* iOS View lifcycle
  public override func viewWillAppear(_ animated: Bool) {
  	super.viewWillAppear(animated)
  
  	// Recreate any view related resources here..
  }
  
  public override func viewDidDisappear(_ animated: Bool) {
  	super.viewDidDisappear(animated)
  
  	// Destroy any view related content here..
  }
  */

  /* macOS View lifcycle
  public override func viewWillAppear() {
  	super.viewWillAppear()
  
  	// Recreate any view related resources here..
  }
  
  public override func viewDidDisappear() {
  	super.viewDidDisappear()
  
  	// Destroy any view related content here..
  }
  */

  public override func viewDidLoad() {
    super.viewDidLoad()

    // Accessing the `audioUnit` parameter prompts the AU to be created via createAudioUnit(with:)
    guard let audioUnit = self.audioUnit else {
      return
    }
    configureSwiftUIView(audioUnit: audioUnit)
  }

  nonisolated public func createAudioUnit(with componentDescription: AudioComponentDescription)
    throws -> AUAudioUnit
  {
    logger.trace("createAudioUnit 1329")
    showEntryInfo(componentDescription)
    SharedContainer.setAppGroupId("group.com.example.sonic.proto-kit-auv3.CyclerXS02")

    return try DispatchQueue.main.sync {

      audioUnit = try PluginAudioUnit(
        componentDescription: componentDescription, options: [])

      guard let audioUnit = self.audioUnit else {
        logger.error("Unable to create PluginAudioUnitViewController")
        return audioUnit!
      }

      defer {
        // Configure the SwiftUI view after creating the AU, instead of in viewDidLoad,
        // so that the parameter tree is set up before we build our @AUParameterUI properties
        DispatchQueue.main.async {
          self.configureSwiftUIView(audioUnit: audioUnit)
        }
      }

      // self.observation = audioUnit.observe(\.allParameterValues, options: [.new]) {
      //   object, change in
      //   guard let tree = audioUnit.parameterTree else { return }

      //   // This insures the Audio Unit gets initial values from the host.
      //   for param in tree.allParameters { param.value = param.value }
      // }

      return audioUnit
    }
  }

  private func configureSwiftUIView(audioUnit: PluginAudioUnit) {
    let controllerPivot = audioUnit.controllerPivot
    let webviewBridge = WebViewBridge(controllerPivot)
    let content = PluginMainView(webviewBridge)
    hostingControllerWrapper.bindView(vc: self, content: AnyView(content))
    audioUnit.viewAdded()
  }

  deinit {
    audioUnit?.viewRemoved()
  }
}
