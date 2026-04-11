import { IDspCore } from "@core/base/api";
import { CommandId } from "@core/base/parameter-id";
import { applyRandomizeParameters } from "@core/parameters/parameter-randomizer";
import { parameterAssigner_applyParameter } from "./parameters/parameter-assigner";
import { SynthesizerHub } from "./synthesizer/synthesizer-hub";

export class SynthesizerRoot implements IDspCore {
  private synthesizerHub: SynthesizerHub;

  constructor() {
    this.synthesizerHub = new SynthesizerHub();
  }

  prepareProcessing(sampleRate: number, _maxFrames: number): void {
    this.synthesizerHub.setupBlWaveTable();
    this.synthesizerHub.prepare(sampleRate);
  }
  setParameter(id: number, value: number): void {
    const bus = this.synthesizerHub.getBus();
    parameterAssigner_applyParameter(bus, id, value);
  }
  noteOn(noteNumber: number, _velocity: number): void {
    this.synthesizerHub.noteOn(noteNumber);
  }
  noteOff(noteNumber: number): void {
    this.synthesizerHub.noteOff(noteNumber);
  }
  processAudio(
    bufferL: Float32Array,
    bufferR: Float32Array,
    frames: number,
  ): void {
    this.synthesizerHub.processSamples(bufferL, frames);
    bufferR.set(bufferL);
  }
  applyCommand(id: number, value: number): void {
    if (id < 0) {
      return;
    }
    if (id === CommandId.setPlayState) {
      this.synthesizerHub.setGroovePlaying(value > 0.5);
    }
  }

  extraLogic_pullRandomizeRequestFlag(): boolean {
    const bus = this.synthesizerHub.getBus();
    const res = bus.randomizationRequestFlag;
    bus.randomizationRequestFlag = false;
    return res;
  }
  extraLogic_randomizeParameters(parameters: Record<number, number>): void {
    applyRandomizeParameters(parameters);
  }
}
