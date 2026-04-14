import { Bus } from "@dsp/base/synthesis-bus";
import {
  createInterpolator,
  Interpolator,
} from "@dsp/dsp-modules/basic/interpolator";
import {
  createDelayLineRingBuffer,
  IDelayLineRingBuffer,
} from "@dsp/dsp-modules/effects/delay-line-ring-buffer";
import { clampValue, mixValue, power2 } from "@dsp/utils/number-utils";

const delayMaxTimeSec = 20 / 1000;

export class Delay {
  private bus: Bus;
  private delayLine: IDelayLineRingBuffer;
  private miDelayPos: Interpolator;
  private miFeed: Interpolator;

  constructor(bus: Bus) {
    this.bus = bus;
    this.delayLine = createDelayLineRingBuffer();
    this.miDelayPos = createInterpolator();
    this.miFeed = createInterpolator();
  }

  prepare() {
    const delayLineLength = this.bus.sampleRate * delayMaxTimeSec;
    this.delayLine.ensureSize(delayLineLength);
  }

  processSamples(buffer: Float32Array, len: number) {
    const sp = this.bus.parameters;
    const interm = this.bus.interm;
    if (!sp.delayOn) return;
    if (this.bus.gateTriggered) {
      this.delayLine.clear();
    }
    if (!sp.delayOn) return;
    const delayLineLength = this.delayLine.size();
    {
      const prFeed = sp.delayFeed;
      let delayPos = 0;
      const prTime = interm.pmxDelayTime;
      const maxNumSamples = delayMaxTimeSec * this.bus.sampleRate;
      delayPos = power2(prTime) * maxNumSamples;
      delayPos = clampValue(delayPos, 1, delayLineLength - 1);
      this.miDelayPos.feed(delayPos, len);
      this.miFeed.feed(prFeed, len);
    }
    for (let i = 0; i < len; i++) {
      const delayPos = this.miDelayPos.advance();
      const feed = this.miFeed.advance();
      const input = buffer[i];
      const dry = input;
      const yd = this.delayLine.take(delayPos);
      // const wet = (input + yd * power2(feed) * 0.9) * 0.707;
      const wet = input + yd * feed * 0.95;
      const y = mixValue(dry, wet, 0.5);
      buffer[i] = y;
      this.delayLine.push(wet);
    }
  }
}
