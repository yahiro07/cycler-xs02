import { mapUnaryTo, power2 } from "@core/ax/number_utils";
import {
  createPhaserAllPass4,
  PhaserAllPass4,
} from "@core/ax-audio/effects/phaser";
import { Bus } from "@core/base/synthesis_bus";

export type Phaser = {
  bus: Bus;
  phaserCore: PhaserAllPass4;
};

export function createPhaser(bus: Bus) {
  const phaserCore = createPhaserAllPass4();
  return { bus, phaserCore };
}

function getCutoffNormFreq(prLevel: number, sampleRate: number) {
  const freq = mapUnaryTo(power2(prLevel), 50, 4000);
  return freq / sampleRate;
}

export function phaser_processSamples(self: Phaser, buffer: Float32Array) {
  const { bus, phaserCore } = self;
  const { sp, interm } = bus;
  if (!sp.phaserOn) return;
  const prLevel = interm.pmxPhaserLevel;
  const cutoffNormFreq = getCutoffNormFreq(prLevel, bus.sampleRate);
  phaserCore.processSamples(buffer, cutoffNormFreq, 0.5);
}
