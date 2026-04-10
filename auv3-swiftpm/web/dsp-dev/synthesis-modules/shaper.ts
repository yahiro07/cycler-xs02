import { Bus } from "@core/base/synthesis-bus";
import {
  createInterpolator,
  Interpolator,
} from "@core/dsp-modules/basic/interpolator";
import {
  createOversamplingStage,
  OversamplingStage,
} from "@core/dsp-modules/filters/oversampling-stage";
import { applyShaper } from "@core/synthesis-modules/funcs/shaper-funcs";

export type Shaper = {
  bus: Bus;
  ovsStage: OversamplingStage;
  miLevel: Interpolator;
};
export function createShaper(bus: Bus) {
  const ovsStage = createOversamplingStage(4);
  const miLevel = createInterpolator();
  return { bus, ovsStage, miLevel };
}

export function shaper_prepare(self: Shaper) {
  self.ovsStage.ensureAllocated(self.bus.maxFrames);
}

export function shaper_processSamples(self: Shaper, buffer: Float32Array) {
  const { bus, ovsStage, miLevel } = self;
  const sp = bus.sp;
  if (!sp.shaperOn) return;
  const highResBuffer = ovsStage.readIn(buffer, true);
  if (!highResBuffer) return;
  miLevel.feed(sp.shaperLevel, highResBuffer.length);
  for (let i = 0; i < highResBuffer.length; i++) {
    const level = miLevel.advance();
    const input = highResBuffer[i];
    const y = applyShaper(input, level, sp.shaperMode);
    highResBuffer[i] = y;
  }
  ovsStage.writeOut();
}
