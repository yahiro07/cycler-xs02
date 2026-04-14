import { Bus } from "@dsp/base/synthesis-bus";
import {
  createInterpolator,
  Interpolator,
} from "@dsp/dsp-modules/basic/interpolator";
import {
  createOversamplingStage,
  OversamplingStage,
} from "@dsp/dsp-modules/filters/oversampling-stage";
import { applyShaper } from "@dsp/synthesis-modules/funcs/shaper-funcs";

const ovsRate = 4;

export class Shaper {
  private bus: Bus;
  private ovsStage: OversamplingStage;
  private miLevel: Interpolator;

  constructor(bus: Bus) {
    this.bus = bus;
    this.ovsStage = createOversamplingStage(ovsRate);
    this.miLevel = createInterpolator();
  }

  prepare() {
    this.ovsStage.ensureAllocated(this.bus.maxFrames);
  }

  processSamples(buffer: Float32Array, len: number) {
    const sp = this.bus.parameters;
    if (!sp.shaperOn) return;
    const highResBuffer = this.ovsStage.readIn(buffer, len, true);
    const hLen = len * ovsRate;
    if (!highResBuffer) return;
    this.miLevel.feed(sp.shaperLevel, hLen);
    for (let i = 0; i < hLen; i++) {
      const level = this.miLevel.advance();
      const input = highResBuffer[i];
      const y = applyShaper(input, level, sp.shaperMode);
      highResBuffer[i] = y;
    }
    this.ovsStage.writeOut();
  }
}
