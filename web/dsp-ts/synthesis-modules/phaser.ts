import { Bus } from "@dsp/base/synthesis-bus";
import { createPhaserAllPass4 } from "@dsp/dsp-modules/effects/phaser";
import { mapUnaryTo, power2 } from "@dsp/utils/number-utils";

export class Phaser {
  private bus: Bus;
  private phaserCore = createPhaserAllPass4();

  constructor(bus: Bus) {
    this.bus = bus;
  }

  private getCutoffNormFreq(prLevel: number, sampleRate: number) {
    const freq = mapUnaryTo(power2(prLevel), 50, 4000);
    return freq / sampleRate;
  }

  processSamples(buffer: Float32Array, len: number) {
    const sp = this.bus.parameters;
    if (!sp.phaserOn) return;
    const prLevel = this.bus.interm.pmxPhaserLevel;
    const cutoffNormFreq = this.getCutoffNormFreq(prLevel, this.bus.sampleRate);
    this.phaserCore.processSamples(buffer, len, cutoffNormFreq, 0.5);
  }
}
