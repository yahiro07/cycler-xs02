class IntervalTimerManager: @unchecked Sendable {
  private var viewCount = 0
  private let intervalTimer = IntervalTimer()
  private var viewActive = false

  private var callback: (@Sendable () -> Void)?

  func setTimerCallbackFn(_ callback: @Sendable @escaping () -> Void) {
    self.callback = callback
  }

  private func onIntervalTimerTick() {
    callback?()
  }

  //initial start
  func start() {
    //if the view is not active, we still run timer with low frequency to flush queued host events
    intervalTimer.start(intervalMs: 1000) { [weak self] in
      self?.onIntervalTimerTick()
    }
  }
  //viewCount 0 --> 1
  func escalateTimerForView() {
    intervalTimer.stop()
    intervalTimer.start(intervalMs: 16) { [weak self] in
      self?.onIntervalTimerTick()
    }
  }
  //viewCount 1 --> 0
  func lowerTimerForView() {
    intervalTimer.stop()
    intervalTimer.start(intervalMs: 1000) { [weak self] in
      self?.onIntervalTimerTick()
    }
  }
  //final stop
  func stop() {
    intervalTimer.stop()
  }

  func viewAdded() {
    viewCount += 1
    if viewCount == 1 {
      viewActive = true
      escalateTimerForView()
    }
  }

  func viewRemoved() {
    viewCount -= 1
    if viewCount == 0 {
      viewActive = false
      lowerTimerForView()
    }
  }
}
