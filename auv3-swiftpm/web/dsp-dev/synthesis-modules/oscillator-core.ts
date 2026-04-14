import { OscWave } from "@core/base/parameter-defs";
import { Bus } from "@core/base/synthesis-bus";
import {
  createInterpolator,
  Interpolator,
} from "@core/dsp-modules/basic/interpolator";
import {
  BlWave2AWaveform,
  blWave2A_getWaveformSample,
} from "@core/dsp-modules/oscillators/bl-wave-2a";
import { modifyPhaseWithColor } from "@core/synthesis-modules/funcs/phase-modifiers";
import { fracPart } from "@core/utils/number-utils";

export class OscillatorCore {
  bus: Bus;
  phase: number;
  miPhaseDelta: Interpolator;
  miColor: Interpolator;

  constructor(bus: Bus) {
    this.bus = bus;
    this.phase = 0;
    this.miPhaseDelta = createInterpolator();
    this.miColor = createInterpolator();
  }
  mapBl2Waveform(wave: OscWave): BlWave2AWaveform {
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
  reset() {
    this.phase = 0;
  }

  processSamples(destBuffer: Float32Array, normFreq: number, gain: number) {
    const { bus, miPhaseDelta, miColor } = this;
    const { sp, interm } = bus;
    const numSamples = destBuffer.length;
    miPhaseDelta.feed(normFreq, numSamples);
    miColor.feed(interm.pmxOscColor, numSamples);

    for (let i = 0; i < numSamples; i++) {
      const phaseDelta = miPhaseDelta.advance();
      const prColor = miColor.advance();

      const wave = this.mapBl2Waveform(sp.oscWave);
      let phase = fracPart(this.phase);
      let speedRate = 1;
      [phase, speedRate] = modifyPhaseWithColor(
        phase,
        prColor,
        sp.oscColorMode,
      );
      const y = blWave2A_getWaveformSample(
        bus.blWave2A,
        wave,
        phase,
        phaseDelta * speedRate,
      );
      destBuffer[i] += y * gain;
      this.phase += phaseDelta;
    }
  }
}
