import { Bus } from "@dsp/base/synthesis-bus";
import {
  createPhaserAllPass4,
  PhaserAllPass4,
} from "@dsp/dsp-modules/effects/phaser";
import { mapUnaryTo, power2 } from "@dsp/utils/number-utils";

export class Phaser {
  private bus: Bus;
  private phaserCore: PhaserAllPass4;

  constructor(bus: Bus) {
    this.bus = bus;
    this.phaserCore = createPhaserAllPass4();
  }

  private getCutoffNormFreq(prLevel: number, sampleRate: number) {
    const freq = mapUnaryTo(power2(prLevel), 50, 4000);
    return freq / sampleRate;
  }

  processSamples(buffer: Float32Array) {
    const { sp, interm } = this.bus;
    if (!sp.phaserOn) return;
    const prLevel = interm.pmxPhaserLevel;
    const cutoffNormFreq = this.getCutoffNormFreq(prLevel, this.bus.sampleRate);
    this.phaserCore.processSamples(buffer, cutoffNormFreq, 0.5);
  }
}
