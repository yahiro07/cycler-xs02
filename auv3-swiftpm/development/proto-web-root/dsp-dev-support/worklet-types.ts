export type WorkletInputMessage =
  | { type: "setParameter"; id: number; value: number }
  | { type: "noteOn"; noteNumber: number; velocity: number }
  | { type: "noteOff"; noteNumber: number }
  | { type: "applyCommand"; id: number; value: number };

export type WorkletWrapper = {
  setParameter(id: number, value: number): void;
  noteOn(noteNumber: number, velocity: number): void;
  noteOff(noteNumber: number): void;
  applyCommand(id: number, value: number): void;
};
