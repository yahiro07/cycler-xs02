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
  private bus: Bus;
  private phase: number;
  private miPhaseDelta: Interpolator;
  private miColor: Interpolator;

  constructor(bus: Bus) {
    this.bus = bus;
    this.phase = 0;
    this.miPhaseDelta = createInterpolator();
    this.miColor = createInterpolator();
  }
  private mapBl2Waveform(wave: OscWave): BlWave2AWaveform {
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
    const { sp, interm } = this.bus;
    const numSamples = destBuffer.length;
    this.miPhaseDelta.feed(normFreq, numSamples);
    this.miColor.feed(interm.pmxOscColor, numSamples);

    for (let i = 0; i < numSamples; i++) {
      const phaseDelta = this.miPhaseDelta.advance();
      const prColor = this.miColor.advance();

      const wave = this.mapBl2Waveform(sp.oscWave);
      let phase = fracPart(this.phase);
      let speedRate = 1;
      [phase, speedRate] = modifyPhaseWithColor(
        phase,
        prColor,
        sp.oscColorMode,
      );
      const y = blWave2A_getWaveformSample(
        this.bus.blWave2A,
        wave,
        phase,
        phaseDelta * speedRate,
      );
      destBuffer[i] += y * gain;
      this.phase += phaseDelta;
    }
  }
}
