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

export class Shaper {
  private bus: Bus;
  private ovsStage: OversamplingStage;
  private miLevel: Interpolator;

  constructor(bus: Bus) {
    this.bus = bus;
    this.ovsStage = createOversamplingStage(4);
    this.miLevel = createInterpolator();
  }

  prepare() {
    this.ovsStage.ensureAllocated(this.bus.maxFrames);
  }

  processSamples(buffer: Float32Array) {
    const sp = this.bus.sp;
    if (!sp.shaperOn) return;
    const highResBuffer = this.ovsStage.readIn(buffer, true);
    if (!highResBuffer) return;
    this.miLevel.feed(sp.shaperLevel, highResBuffer.length);
    for (let i = 0; i < highResBuffer.length; i++) {
      const level = this.miLevel.advance();
      const input = highResBuffer[i];
      const y = applyShaper(input, level, sp.shaperMode);
      highResBuffer[i] = y;
    }
    this.ovsStage.writeOut();
  }
}
