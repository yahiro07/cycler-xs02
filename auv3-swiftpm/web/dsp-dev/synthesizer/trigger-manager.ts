import { Bus } from "@core/base/synthesis-bus";

export class TriggerManager {
  private bus: Bus;
  private groovePlaying: boolean;
  private notePlaying: boolean;
  private notePlayingOverrideNoteNumber: number;
  private prevBaseNoteIndex: number;

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

  stopNote(noteNumber: number) {
    if (this.notePlayingOverrideNoteNumber === noteNumber) {
      this.notePlaying = false;
      this.notePlayingOverrideNoteNumber = -1;
    }
  }

  updateNoteStates() {
    const { sp } = this.bus;
    const nextGateOn = this.groovePlaying || this.notePlaying;

    let gateTriggered = false;

    if (!this.bus.gateOn && nextGateOn) {
      this.bus.gateOn = true;
      gateTriggered = true;
    } else if (this.bus.gateOn && !nextGateOn) {
      this.bus.gateOn = false;
    }
    if (sp.baseNoteIndex !== this.prevBaseNoteIndex) {
      this.notePlayingOverrideNoteNumber = -1;
      this.prevBaseNoteIndex = sp.baseNoteIndex;
    }
    const noteNumber =
      this.notePlayingOverrideNoteNumber !== -1
        ? this.notePlayingOverrideNoteNumber
        : 36 + sp.baseNoteIndex;
    this.bus.noteNumber = noteNumber;
    this.bus.beatActive = this.groovePlaying && sp.clockingOn;
    this.bus.gateTriggered = gateTriggered;
    return gateTriggered;
  }
}
