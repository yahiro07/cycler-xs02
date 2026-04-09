import AVFoundation
import DspRoute

public class PluginAudioUnit: AUAudioUnit, @unchecked Sendable {
  // C++ Objects
  var dspKernel = PluginDSPKernel()
  var processHelper: AUProcessHelper?
  private var outputBus: AUAudioUnitBus?
  private var _outputBusses: AUAudioUnitBusArray!
  private let format: AVAudioFormat

  private let dspKernelAgent: DspKernelAgent
  private let parametersService: ParametersService
  private let storageFileIoService = StorageFileIoService()
  private let stateKvsService = StateKvsService()
  internal let controllerPivot: ControllerPivot

  private var parameterChangesToken: Int = 0

  private let intervalTimerManager = IntervalTimerManager()

  @objc override init(
    componentDescription: AudioComponentDescription, options: AudioComponentInstantiationOptions
  ) throws {
    dspKernelAgent = DspKernelAgent(dspKernel: &dspKernel)
    let parameterTree = buildPluginParameterSpecs().createAUParameterTree()
    parametersService = ParametersService(parameterTree: parameterTree)
    controllerPivot = ControllerPivot(
      dspKernelAgent: dspKernelAgent,
      parametersService: parametersService,
      storageFileIoService: storageFileIoService,
      stateKvsService: stateKvsService)
    self.format = AVAudioFormat(standardFormatWithSampleRate: 44_100, channels: 2)!
    try super.init(componentDescription: componentDescription, options: options)
    outputBus = try AUAudioUnitBus(format: self.format)
    outputBus?.maximumChannelCount = 2
    _outputBusses = AUAudioUnitBusArray(
      audioUnit: self, busType: AUAudioUnitBusType.output, busses: [outputBus!])
    processHelper = AUProcessHelper(&dspKernel)
    setupParameterStore(parameterTree)
    intervalTimerManager.setTimerCallbackFn(onIntervalTimerTick)
    intervalTimerManager.start()
    setupSubscriptions()
  }

  deinit {
    intervalTimerManager.stop()
    cleanupSubscriptions()
  }

  func setupSubscriptions() {
    parameterChangesToken =
      parametersService.subscribeParameterChanges {
        [weak self] paramKey, value in
        self?.controllerPivot.broadcastParameterChange(paramKey, value)
      }
  }

  func cleanupSubscriptions() {
    if parameterChangesToken != 0 {
      parametersService.unsubscribeParameterChanges(parameterChangesToken)
      parameterChangesToken = 0
    }
  }

  public override var outputBusses: AUAudioUnitBusArray {
    return _outputBusses
  }

  public override var maximumFramesToRender: AUAudioFrameCount {
    get {
      return dspKernel.maximumFramesToRender()
    }

    set {
      dspKernel.setMaximumFramesToRender(newValue)
    }
  }

  public override var shouldBypassEffect: Bool {
    get {
      return dspKernel.isBypassed()
    }

    set {
      dspKernel.setBypass(newValue)
    }
  }

  // MARK: - MIDI
  public override var audioUnitMIDIProtocol: MIDIProtocolID {
    return dspKernel.AudioUnitMIDIProtocol()
  }

  // MARK: - Rendering
  public override var internalRenderBlock: AUInternalRenderBlock {
    return processHelper!.internalRenderBlock()
  }

  // Allocate resources required to render.
  // Subclassers should call the superclass implementation.
  public override func allocateRenderResources() throws {
    let outputChannelCount = self.outputBusses[0].format.channelCount

    dspKernel.setMusicalContextBlock(self.musicalContextBlock)
    dspKernel.initialize(Int32(outputChannelCount), outputBus!.format.sampleRate)

    processHelper?.setChannelCount(0, self.outputBusses[0].format.channelCount)

    try super.allocateRenderResources()
  }

  // Deallocate resources allocated in allocateRenderResourcesAndReturnError:
  // Subclassers should call the superclass implementation.
  public override func deallocateRenderResources() {

    // Deallocate your resources.
    dspKernel.deInitialize()

    super.deallocateRenderResources()
  }

  private func setupParameterStore(_ parameterTree: AUParameterTree) {
    let parameterStore = ParameterStore()

    for param in parameterTree.allParameters {
      parameterStore.set(param.address, param.value)
      dspKernel.setParameter(param.address, param.value)
    }
    parameterStore.stateKnownKeysInserted()

    parameterTree.implementorValueObserver = { [weak self] param, value -> Void in
      // logger.log("parameter changed: \(param.address) \(value)")
      parameterStore.set(param.address, value)
      self?.dspKernel.pushParameterChange(param.address, value)
    }
    parameterTree.implementorValueProvider = { param in
      parameterStore.get(param.address)
    }
    parameterTree.implementorStringFromValueCallback = { param, valuePtr in
      guard let value = valuePtr?.pointee else {
        return "-"
      }
      return NSString.localizedStringWithFormat("%.f", value) as String
    }
  }

  public override var fullState: [String: Any]? {
    get {
      logger.log("fullState saving")
      let baseState = super.fullState
      var state: [String: Any] = [
        "type": componentDescription.componentType,
        "subtype": componentDescription.componentSubType,
        "manufacturer": componentDescription.componentManufacturer,
        "version": baseState?["version"] as? Int ?? 0,
      ]
      state["kvsItems"] = stateKvsService.getItems()
      let parameters = parametersService.getAllParameterValues()
      state["parameters"] = parameters
      return state
    }

    set(newValue) {
      logger.log("fullState restoration")
      guard let state = newValue else { return }
      // if let flag = state["MySynth1.hostedInStandaloneApp"] as? Bool {
      //   self.isHostedInStandaloneApp = flag
      // }
      if let parameters = state["parameters"] as? [String: Float] {
        parametersService.loadFullParametersSuit(parameters)
      }
      if let kvsItems = state["kvsItems"] as? [String: String] {
        stateKvsService.setItems(kvsItems)
      }
      //skipping super.fullState to avoid overwriting our custom restoration results.
      // super.fullState = state
    }
  }

  // private let isStandalone = false

  private func handleHostBpmChange(_ bpm: Float) {
    logger.log("host bpm change: \(bpm)")
    // if isStandalone {
    //   //standalone
    // } else {
    //executed in host app
    //Host bpm --> DSP, UI
    parametersService.setInternalParameterFromHost(parameterIds.internalBpm, bpm)
    // }
  }

  func updateParameterRandomization() {
    if dspKernel.extraLogic_pullRandomizeRequestFlag() {
      parametersService.randomizeParameters()
    }
  }

  func drainHostEvents() {
    dspKernelAgent.drainHostEvents { event in
      self.controllerPivot.broadcastHostEvent(event)
      switch event {
      case .hostTempo(let bpm):
        handleHostBpmChange(bpm)
      default:
        break
      }
    }
  }

  func onIntervalTimerTick() {
    drainHostEvents()
    // if viewActive {
    updateParameterRandomization()
    // }
  }

  func viewAdded() {
    intervalTimerManager.viewAdded()
  }

  func viewRemoved() {
    intervalTimerManager.viewRemoved()
  }
}
