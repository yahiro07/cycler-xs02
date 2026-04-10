import { clampValue, mixValue, power2 } from "@core/ax/number_utils";
import {
  createInterpolator,
  Interpolator,
} from "@core/ax-audio/basic/interpolator";
import {
  createDelayLineRingBuffer,
  IDelayLineRingBuffer,
} from "@core/ax-audio/effects/delay_line_ring_buffer";
import { Bus } from "@core/base/synthesis_bus";

export type Delay = {
  bus: Bus;
  delayLine: IDelayLineRingBuffer;
  miDelayPos: Interpolator;
  miFeed: Interpolator;
};

export function createDelay(bus: Bus) {
  const delayLine = createDelayLineRingBuffer();
  const miDelayPos = createInterpolator();
  const miFeed = createInterpolator();
  return { bus, delayLine, miDelayPos, miFeed };
}

const delayMaxTimeSec = 20 / 1000;

export function delay_prepare(self: Delay) {
  const { bus, delayLine } = self;
  const delayLineLength = bus.sampleRate * delayMaxTimeSec;
  delayLine.ensureSize(delayLineLength);
}

export function delay_processSamples(self: Delay, buffer: Float32Array) {
  const { bus, delayLine, miDelayPos, miFeed } = self;
  const { sp, interm } = bus;
  if (!sp.delayOn) return;
  if (bus.gateTriggered) {
    delayLine.clear();
  }
  if (!sp.delayOn) return;
  const delayLineLength = delayLine.size();
  const n = buffer.length;
  {
    const prFeed = sp.delayFeed;
    let delayPos = 0;
    const prTime = interm.pmxDelayTime;
    const maxNumSamples = delayMaxTimeSec * bus.sampleRate;
    delayPos = power2(prTime) * maxNumSamples;
    delayPos = clampValue(delayPos, 1, delayLineLength - 1);
    miDelayPos.feed(delayPos, n);
    miFeed.feed(prFeed, n);
  }
  for (let i = 0; i < n; i++) {
    const delayPos = miDelayPos.advance();
    const feed = miFeed.advance();
    const input = buffer[i];
    const dry = input;
    const yd = delayLine.take(delayPos);
    // const wet = (input + yd * power2(feed) * 0.9) * 0.707;
    const wet = input + yd * feed * 0.95;
    const y = mixValue(dry, wet, 0.5);
    buffer[i] = y;
    delayLine.push(wet);
  }
}
