export enum ParameterId {
  oscEnabled = 0,
  oscWave,
  oscPitch,
  oscVolume,
}

export class DspCore implements IDspCore {
  prepareProcessing(sampleRate: number, maxFrames: number): void {}
  setParameter(id: number, value: number): void {}
  noteOn(noteNumber: number, velocity: number): void {}
  noteOff(noteNumber: number): void {}
  processAudio(
    bufferL: Float32Array,
    bufferR: Float32Array,
    frames: number,
  ): void {
    for (let i = 0; i < frames; i++) {
      const y = (Math.random() * 2 - 1) * 0.1;
      bufferL[i] = y;
      bufferR[i] = y;
    }
  }
}
