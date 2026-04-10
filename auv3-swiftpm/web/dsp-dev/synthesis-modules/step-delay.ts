import { Bus } from "@core/base/synthesis-bus";
import { calcNumSamplesForSteps } from "@core/dsp-modules/basic/sequence-helper";
import {
  createDelayLineRingBuffer,
  IDelayLineRingBuffer,
} from "@core/dsp-modules/effects/delay-line-ring-buffer";
import { getStepPeriodForDelay } from "@core/motions/funcs/steps-common";
import { clampValue, mixValue, power2 } from "@core/utils/number-utils";

export class StepDelay {
  bus: Bus;
  delayLine: IDelayLineRingBuffer;

  constructor(bus: Bus) {
    this.bus = bus;
    this.delayLine = createDelayLineRingBuffer();
  }

  prepare() {
    const delayMaxTimeSec = 1;
    const delayLineLength = this.bus.sampleRate * delayMaxTimeSec;
    this.delayLine.ensureSize(delayLineLength);
  }

  processSamples(buffer: Float32Array) {
    const { bus, delayLine } = this;
    const { sp } = bus;
    if (!sp.stepDelayOn) return;
    if (bus.gateTriggered) {
      delayLine.clear();
    }
    const delayLineLength = delayLine.size();

    const n = buffer.length;
    const steps = getStepPeriodForDelay(sp.stepDelayStep);
    let delayPos = calcNumSamplesForSteps(bus.bpm, bus.sampleRate, steps);
    delayPos = clampValue(delayPos, 1, delayLineLength - 1);

    for (let i = 0; i < n; i++) {
      let y = buffer[i];
      const dry = y;
      const yd = delayLine.take(delayPos);
      const wet = y + yd * power2(sp.stepDelayFeed) * 0.9;
      y = mixValue(dry, wet, sp.stepDelayMix);
      buffer[i] = y;
      delayLine.push(y);
    }
  }
}
