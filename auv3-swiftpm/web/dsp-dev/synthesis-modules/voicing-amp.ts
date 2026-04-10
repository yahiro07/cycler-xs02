import { Bus } from "@core/base/synthesis-bus";
import {
  createInterpolator,
  Interpolator,
} from "@core/dsp-modules/basic/interpolator";

export type VoicingAmp = {
  bus: Bus;
  miGain: Interpolator;
};

export function createVoicingAmp(bus: Bus) {
  const miGain = createInterpolator();
  return { bus, miGain };
}

export function voicingAmp_reset(self: VoicingAmp) {
  const { miGain } = self;
  miGain.reset();
}
export function voicingAmp_processSamples(
  self: VoicingAmp,
  buffer: Float32Array,
) {
  const { bus, miGain } = self;
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
