import { IDspCore } from "@dsp/base/api";
import { CommandId } from "@dsp/base/parameter-id";
import { applyRandomizeParameters } from "@dsp/parameters/parameter-randomizer";
import { parameterAssigner_applyParameter } from "./parameters/parameter-assigner";
import { SynthesizerHub } from "./synthesizer/synthesizer-hub";

export class SynthesizerRoot implements IDspCore {
  private synthesizerHub: SynthesizerHub;

  private hostPlayState = false;
  private playState = false;

  constructor() {
    this.synthesizerHub = new SynthesizerHub();
  }

  prepareProcessing(sampleRate: number, _maxFrames: number): void {
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
    if (id === CommandId.setHostPlayState) {
      this.hostPlayState = value > 0.5;
      this.synthesizerHub.setGroovePlaying(
        this.hostPlayState && this.playState,
      );
    } else if (id === CommandId.setPlayState) {
      this.playState = value > 0.5;
      this.synthesizerHub.setGroovePlaying(
        this.hostPlayState && this.playState,
      );
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
