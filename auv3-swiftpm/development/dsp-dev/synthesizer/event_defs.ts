export enum SynthEventType {
  Command,
  Parameter,
}

export type SynthEvent = {
  type: SynthEventType;
  id: number;
  value1: number;
  value2: number;
  sampleOffset: number;
};
