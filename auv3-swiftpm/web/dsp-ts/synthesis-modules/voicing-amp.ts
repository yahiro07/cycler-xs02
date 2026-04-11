import { Bus } from "@dsp/base/synthesis-bus";
import {
  createInterpolator,
  Interpolator,
} from "@dsp/dsp-modules/basic/interpolator";

export class VoicingAmp {
  private bus: Bus;
  private miGain: Interpolator;

  constructor(bus: Bus) {
    this.bus = bus;
    this.miGain = createInterpolator();
  }

  reset() {
    this.miGain.reset();
  }

  processSamples(buffer: Float32Array, len: number) {
    const { sp, interm } = this.bus;
    let g = 0;
    if (this.bus.gateOn) g = 1;
    if (sp.ampOn) {
      g *= interm.ampGain;
    }
    this.miGain.feed(g, len);
    for (let i = 0; i < len; i++) {
      const gain = this.miGain.advance();
      buffer[i] *= gain;
    }
  }
}
