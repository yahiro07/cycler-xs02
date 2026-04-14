import { OscWave } from "@dsp/base/parameter-defs";
import { Bus } from "@dsp/base/synthesis-bus";
import {
  createInterpolator,
  Interpolator,
} from "@dsp/dsp-modules/basic/interpolator";
import {
  BlWaveWaveform,
  blWaveProvider,
} from "@dsp/dsp-modules/oscillators/bl-wave-provider";
import { modifyPhaseWithColor } from "@dsp/synthesis-modules/funcs/phase-modifiers";
import { fracPart } from "@dsp/utils/number-utils";

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
  private mapBl2Waveform(wave: OscWave): BlWaveWaveform {
    switch (wave) {
      case OscWave.saw:
        return BlWaveWaveform.saw;
      case OscWave.rect:
        return BlWaveWaveform.rect;
      case OscWave.tri:
        return BlWaveWaveform.tri;
      case OscWave.sine:
        return BlWaveWaveform.sine;
    }
  }
  reset() {
    this.phase = 0;
  }

  processSamples(
    destBuffer: Float32Array,
    len: number,
    normFreq: number,
    gain: number,
  ) {
    const sp = this.bus.parameters;
    const interm = this.bus.interm;
    this.miPhaseDelta.feed(normFreq, len);
    this.miColor.feed(interm.pmxOscColor, len);

    for (let i = 0; i < len; i++) {
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
      const y = blWaveProvider.getWaveformSample(
        wave,
        phase,
        phaseDelta * speedRate,
      );
      destBuffer[i] += y * gain;
      this.phase += phaseDelta;
    }
  }
}
