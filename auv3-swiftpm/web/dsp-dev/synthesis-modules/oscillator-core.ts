import { fracPart } from "@core/ax/number-utils";
import {
  createInterpolator,
  Interpolator,
} from "@core/ax-audio/basic/interpolator";
import {
  BlWave2AWaveform,
  blWave2A_getWaveformSample,
} from "@core/ax-audio/oscillators/bl-wave-2a";
import { OscWave } from "@core/base/parameter-defs";
import { Bus } from "@core/base/synthesis-bus";
import { modifyPhaseWithColor } from "@core/synthesis-modules/funcs/phase-modifiers";

export type OscillatorCore = {
  bus: Bus;
  phase: number;
  miPhaseDelta: Interpolator;
  miColor: Interpolator;
};

export function createOscillatorCore(bus: Bus) {
  return {
    bus,
    phase: 0,
    miPhaseDelta: createInterpolator(),
    miColor: createInterpolator(),
  };
}

function mapBl2Waveform(wave: OscWave): BlWave2AWaveform {
  switch (wave) {
    case OscWave.saw:
      return BlWave2AWaveform.saw;
    case OscWave.rect:
      return BlWave2AWaveform.rect;
    case OscWave.tri:
      return BlWave2AWaveform.tri;
    case OscWave.sine:
      return BlWave2AWaveform.sine;
  }
}

export function oscillatorCore_reset(self: OscillatorCore) {
  self.phase = 0;
}

export function oscillatorCore_processSamples(
  self: OscillatorCore,
  destBuffer: Float32Array,
  normFreq: number,
  gain: number,
) {
  const { bus, miPhaseDelta, miColor } = self;
  const { sp, interm } = bus;
  const numSamples = destBuffer.length;
  miPhaseDelta.feed(normFreq, numSamples);
  miColor.feed(interm.pmxOscColor, numSamples);

  for (let i = 0; i < numSamples; i++) {
    const phaseDelta = miPhaseDelta.advance();
    const prColor = miColor.advance();

    const wave = mapBl2Waveform(sp.oscWave);
    let phase = fracPart(self.phase);
    let speedRate = 1;
    [phase, speedRate] = modifyPhaseWithColor(phase, prColor, sp.oscColorMode);
    const y = blWave2A_getWaveformSample(
      bus.blWave2A,
      wave,
      phase,
      phaseDelta * speedRate,
    );
    destBuffer[i] += y * gain;
    self.phase += phaseDelta;
  }
}
