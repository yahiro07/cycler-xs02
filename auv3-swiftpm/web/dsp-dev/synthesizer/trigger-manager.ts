import { Bus } from "@core/base/synthesis-bus";

export class TriggerManager {
  bus: Bus;
  groovePlaying: boolean;
  notePlaying: boolean;
  notePlayingOverrideNoteNumber: number;
  prevBaseNoteIndex: number;

  constructor(bus: Bus) {
    this.bus = bus;
    this.groovePlaying = false;
    this.notePlaying = false;
    this.notePlayingOverrideNoteNumber = -1;
    this.prevBaseNoteIndex = -1;
  }

  setGroovePlaying(playing: boolean) {
    this.groovePlaying = playing;
  }

  playNote(noteNumber: number) {
    this.notePlaying = true;
    this.notePlayingOverrideNoteNumber = noteNumber;
  }

  stopNote() {
    this.notePlaying = false;
  }

  updateNoteStates() {
    const {
      bus,
      groovePlaying,
      notePlaying,
      notePlayingOverrideNoteNumber,
      prevBaseNoteIndex,
    } = this;
    const { sp } = bus;
    const nextGateOn = groovePlaying || notePlaying;

    let gateTriggered = false;

    if (!bus.gateOn && nextGateOn) {
      bus.gateOn = true;
      gateTriggered = true;
    } else if (bus.gateOn && !nextGateOn) {
      bus.gateOn = false;
    }
    if (sp.baseNoteIndex !== prevBaseNoteIndex) {
      this.notePlayingOverrideNoteNumber = -1;
      this.prevBaseNoteIndex = sp.baseNoteIndex;
    }
    const noteNumber =
      notePlayingOverrideNoteNumber !== -1
        ? notePlayingOverrideNoteNumber
        : 36 + sp.baseNoteIndex;
    bus.noteNumber = noteNumber;
    bus.beatActive = groovePlaying && sp.clockingOn;
    bus.gateTriggered = gateTriggered;
    return gateTriggered;
  }
}
