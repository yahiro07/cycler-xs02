#pragma once
#include "../base/synthesis-bus.h"

namespace dsp {

class TriggerManager {
private:
  SynthesisBus &bus;
  bool groovePlaying = false;
  bool notePlaying = false;
  int notePlayingOverrideNoteNumber = -1;
  int prevBaseNoteIndex = -1;

public:
  explicit TriggerManager(SynthesisBus &bus) : bus(bus) {}

  void setGroovePlaying(bool playing) { groovePlaying = playing; }

  void playNote(int noteNumber) {
    notePlaying = true;
    notePlayingOverrideNoteNumber = noteNumber;
  }

  void stopNote(int noteNumber) {
    if (notePlayingOverrideNoteNumber == noteNumber) {
      notePlaying = false;
      notePlayingOverrideNoteNumber = -1;
    }
  }

  bool updateNoteStates() {
    const auto &sp = bus.parameters;
    const bool nextGateOn = groovePlaying || notePlaying;

    bool gateTriggered = false;

    if (!bus.gateOn && nextGateOn) {
      bus.gateOn = true;
      gateTriggered = true;
    } else if (bus.gateOn && !nextGateOn) {
      bus.gateOn = false;
    }

    if (sp.baseNoteIndex != prevBaseNoteIndex) {
      notePlayingOverrideNoteNumber = -1;
      prevBaseNoteIndex = sp.baseNoteIndex;
    }

    const int noteNumber = (notePlayingOverrideNoteNumber != -1)
                               ? notePlayingOverrideNoteNumber
                               : 36 + sp.baseNoteIndex;
    bus.noteNumber = noteNumber;
    bus.beatActive = groovePlaying && sp.clockingOn;
    bus.gateTriggered = gateTriggered;
    return gateTriggered;
  }
};

} // namespace dsp
