import { Bus } from "@core/base/synthesis_bus";

export type TriggerManager = {
  bus: Bus;
  groovePlaying: boolean;
  notePlaying: boolean;
  notePlayingOverrideNoteNumber: number;
  prevBaseNoteIndex: number;
};

export function createTriggerManager(bus: Bus): TriggerManager {
  return {
    bus,
    groovePlaying: false,
    notePlaying: false,
    notePlayingOverrideNoteNumber: -1,
    prevBaseNoteIndex: -1,
  };
}

export function triggerManager_setGroovePlaying(
  self: TriggerManager,
  playing: boolean,
) {
  self.groovePlaying = playing;
}

export function triggerManager_playNote(
  self: TriggerManager,
  noteNumber: number,
) {
  self.notePlaying = true;
  self.notePlayingOverrideNoteNumber = noteNumber;
}

export function triggerManager_stopNote(self: TriggerManager) {
  self.notePlaying = false;
}

export function triggerManager_updateNoteStates(self: TriggerManager) {
  const {
    bus,
    groovePlaying,
    notePlaying,
    notePlayingOverrideNoteNumber,
    prevBaseNoteIndex,
  } = self;
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
    self.notePlayingOverrideNoteNumber = -1;
    self.prevBaseNoteIndex = sp.baseNoteIndex;
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
