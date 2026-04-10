import {
  createInterpolator,
  Interpolator,
} from "@core/ax-audio/basic/interpolator";
import {
  createOversamplingStage,
  OversamplingStage,
} from "@core/ax-audio/filters/oversampling-stage";
import { Bus } from "@core/base/synthesis-bus";
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
