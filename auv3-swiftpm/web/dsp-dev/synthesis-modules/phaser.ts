import { Bus } from "@core/base/synthesis-bus";
import {
  createPhaserAllPass4,
  PhaserAllPass4,
} from "@core/dsp-modules/effects/phaser";
import { mapUnaryTo, power2 } from "@core/utils/number-utils";

export class Phaser {
  bus: Bus;
  phaserCore: PhaserAllPass4;

  constructor(bus: Bus) {
    this.bus = bus;
    this.phaserCore = createPhaserAllPass4();
  }

  getCutoffNormFreq(prLevel: number, sampleRate: number) {
    const freq = mapUnaryTo(power2(prLevel), 50, 4000);
    return freq / sampleRate;
  }

  processSamples(buffer: Float32Array) {
    const { bus, phaserCore } = this;
    const { sp, interm } = bus;
    if (!sp.phaserOn) return;
    const prLevel = interm.pmxPhaserLevel;
    const cutoffNormFreq = this.getCutoffNormFreq(prLevel, bus.sampleRate);
    phaserCore.processSamples(buffer, cutoffNormFreq, 0.5);
  }
}
