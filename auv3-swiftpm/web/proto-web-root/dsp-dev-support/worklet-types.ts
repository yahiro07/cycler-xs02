export type WorkletInputMessage =
  | { type: "setParameter"; id: number; value: number }
  | { type: "noteOn"; noteNumber: number; velocity: number }
  | { type: "noteOff"; noteNumber: number }
  | { type: "applyCommand"; id: number; value: number }
  | { type: "pullRandomizeRequestFlag" }
  | { type: "randomizeParameters"; parameters: Record<number, number> };

export type WorkletOutputMessage =
  | { type: "pullRandomizeRequestFlag_response"; value: boolean }
  | {
      type: "randomizeParameters_response";
      parameters: Record<number, number>;
    };

export type WorkletWrapper = {
  resumeIfNeed(): Promise<void>;
  setParameter(id: number, value: number): void;
  noteOn(noteNumber: number, velocity: number): void;
  noteOff(noteNumber: number): void;
  applyCommand(id: number, value: number): void;
  sendMessage(msg: WorkletInputMessage): void;
  subscribeMessage(fn: (ev: WorkletOutputMessage) => void): void;
};
