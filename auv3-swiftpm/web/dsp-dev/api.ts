export interface IDspCore {
  prepareProcessing(sampleRate: number, maxFrames: number): void;
  setParameter(id: number, value: number): void;
  noteOn(noteNumber: number, velocity: number): void;
  noteOff(noteNumber: number): void;
  processAudio(
    bufferL: Float32Array,
    bufferR: Float32Array,
    frames: number,
  ): void;
  applyCommand(id: number, value: number): void;
  //
  extraLogic_pullRandomizeRequestFlag(): boolean;
  extraLogic_randomizeParameters(parameters: Record<number, number>): void;
}
