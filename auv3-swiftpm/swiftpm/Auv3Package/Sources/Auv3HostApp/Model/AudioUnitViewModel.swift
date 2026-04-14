import AudioToolbox
import CoreAudioKit
import SwiftUI

struct AudioUnitViewModel {
  var showAudioControls: Bool = false
  var showMIDIContols: Bool = false
  var title: String = "-"
  var message: String = "loading Audio Unit.."
  var viewController: ViewController?
}
