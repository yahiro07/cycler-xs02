import { Bus } from "@core/base/synthesis-bus";
import {
  createInterpolator,
  Interpolator,
} from "@core/dsp-modules/basic/interpolator";

export class VoicingAmp {
  bus: Bus;
  miGain: Interpolator;

  constructor(bus: Bus) {
    this.bus = bus;
    this.miGain = createInterpolator();
  }

  reset() {
    this.miGain.reset();
  }

  processSamples(buffer: Float32Array) {
    const { bus, miGain } = this;
    const { sp, interm } = bus;
    const n = buffer.length;
    let g = 0;
    if (bus.gateOn) g = 1;
    if (sp.ampOn) {
      g *= interm.ampGain;
    }
    miGain.feed(g, n);
    for (let i = 0; i < n; i++) {
      const gain = miGain.advance();
      buffer[i] *= gain;
    }
  }
}
