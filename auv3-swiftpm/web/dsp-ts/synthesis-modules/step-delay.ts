import { Bus } from "@dsp/base/synthesis-bus";
import { calcNumSamplesForSteps } from "@dsp/dsp-modules/basic/sequence-helper";
import {
  createDelayLineRingBuffer,
  IDelayLineRingBuffer,
} from "@dsp/dsp-modules/effects/delay-line-ring-buffer";
import { getStepPeriodForDelay } from "@dsp/motions/funcs/steps-common";
import { clampValue, mixValue, power2 } from "@dsp/utils/number-utils";

export class StepDelay {
  private bus: Bus;
  private delayLine: IDelayLineRingBuffer;

  constructor(bus: Bus) {
    this.bus = bus;
    this.delayLine = createDelayLineRingBuffer();
  }

  prepare() {
    const delayMaxTimeSec = 1;
    const delayLineLength = this.bus.sampleRate * delayMaxTimeSec;
    this.delayLine.ensureSize(delayLineLength);
  }

  processSamples(buffer: Float32Array, len: number) {
    const { sp } = this.bus;
    if (!sp.stepDelayOn) return;
    if (this.bus.gateTriggered) {
      this.delayLine.clear();
    }
    const delayLineLength = this.delayLine.size();

    const steps = getStepPeriodForDelay(sp.stepDelayStep);
    let delayPos = calcNumSamplesForSteps(
      this.bus.bpm,
      this.bus.sampleRate,
      steps,
    );
    delayPos = clampValue(delayPos, 1, delayLineLength - 1);

    for (let i = 0; i < len; i++) {
      let y = buffer[i];
      const dry = y;
      const yd = this.delayLine.take(delayPos);
      const wet = y + yd * power2(sp.stepDelayFeed) * 0.9;
      y = mixValue(dry, wet, sp.stepDelayMix);
      buffer[i] = y;
      this.delayLine.push(y);
    }
  }
}
