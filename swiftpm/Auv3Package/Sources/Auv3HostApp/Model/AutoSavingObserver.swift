import AudioToolbox

@MainActor
final class AutoSavingObserver {
  private var parameterObserverToken: AUParameterObserverToken?
  private var delayedSaveTask: Task<Void, Never>?
  private let stateSaveDelay: Duration = .seconds(5)
  private var audioUnit: AUAudioUnit?
  private var saveState: @MainActor @Sendable () -> Void = {}

  func setup(audioUnit: AUAudioUnit, saveState: @escaping @MainActor @Sendable () -> Void) {
    self.audioUnit = audioUnit
    self.saveState = saveState
  }

  deinit {
    self.delayedSaveTask?.cancel()
    Task { @MainActor [weak self] in
      self?.stopObservingParameterChanges()
    }
  }

  func startObservingParameterChanges() {
    stopObservingParameterChanges()

    guard let parameterTree = audioUnit?.parameterTree else { return }

    parameterObserverToken = parameterTree.token(byAddingParameterObserver: { @Sendable [weak self] _, _ in
      Task { @MainActor [weak self] in
        self?.scheduleDelayedStateSave()
      }
    })
  }

  private func stopObservingParameterChanges() {
    guard
      let parameterTree = self.audioUnit?.parameterTree,
      let parameterObserverToken
    else { return }

    parameterTree.removeParameterObserver(parameterObserverToken)
    self.parameterObserverToken = nil
  }

  private func scheduleDelayedStateSave() {
    delayedSaveTask?.cancel()
    delayedSaveTask = Task { @MainActor [weak self] in
      guard let self else { return }

      do {
        try await Task.sleep(for: self.stateSaveDelay)
      } catch {
        return
      }

      guard !Task.isCancelled else { return }
      self.saveState()
    }
  }
}
