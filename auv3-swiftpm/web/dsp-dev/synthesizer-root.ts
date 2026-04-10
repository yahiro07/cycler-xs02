import { IDspCore } from "@core/api";
import { getLoopBarsFromKey } from "@core/motions/funcs/steps-common";
import { CommandId } from "@core/parameter-id";
import { applyRandomizeParameters } from "@core/parameter-randomizer";
import { ControlCommand } from "./synthesizer/control-command";
import { parameterAssigner_applyParameter } from "./synthesizer/parameter-assigner";
import { SynthesizerHub } from "./synthesizer/synthesizer-hub";

export class SynthesizerRoot implements IDspCore {
  synthesizerHub: SynthesizerHub;
  playingNoteNumber: number;

  constructor() {
    this.synthesizerHub = new SynthesizerHub();
    this.playingNoteNumber = -1;
  }

  prepareProcessing(sampleRate: number, _maxFrames: number): void {
    this.synthesizerHub.setupBlWaveTable();
    this.synthesizerHub.prepare(sampleRate);
  }
  setParameter(id: number, value: number): void {
    parameterAssigner_applyParameter(this.synthesizerHub.bus.sp, id, value);
  }
  noteOn(noteNumber: number, _velocity: number): void {
    this.synthesizerHub.playNote(noteNumber);
    this.playingNoteNumber = noteNumber;
  }
  noteOff(noteNumber: number): void {
    if (noteNumber === this.playingNoteNumber) {
      this.synthesizerHub.stopNote();
      this.playingNoteNumber = -1;
    }
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
    } else if (id === ControlCommand.kcSetBpm) {
      this.synthesizerHub.setBpm(value);
    }
  }

  prevBar = 0;

  extraLogic_pullRandomizeRequestFlag(): boolean {
    const bus = this.synthesizerHub.bus;
    const bar = this.synthesizerHub.getBarPosition();
    const loopBars = getLoopBarsFromKey(bus.sp.loopBars);
    const res =
      bus.sp.autoRandomizeOnLoop &&
      bar > 0 &&
      bar > this.prevBar &&
      bar % loopBars === 0;
    this.prevBar = bar;
    return res;
  }
  extraLogic_randomizeParameters(parameters: Map<number, number>): void {
    applyRandomizeParameters(parameters);
  }
}
