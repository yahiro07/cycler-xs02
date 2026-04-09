import { clampValue, mixValue, power2 } from "@core/ax/number_utils";
import { calcNumSamplesForSteps } from "@core/ax-audio/basic/sequence_helper";
import {
  createDelayLineRingBuffer,
  IDelayLineRingBuffer,
} from "@core/ax-audio/effects/delay_line_ring_buffer";
import { Bus } from "@core/base/synthesis_bus";
import { getStepPeriodForDelay } from "@core/motions/funcs/steps_common";

export type StepDelay = {
  bus: Bus;
  delayLine: IDelayLineRingBuffer;
};

export function createStepDelay(bus: Bus) {
  const delayLine = createDelayLineRingBuffer();
  return { bus, delayLine };
}

export function stepDelay_prepare(self: StepDelay) {
  const { bus, delayLine } = self;
  const delayMaxTimeSec = 1;
  const delayLineLength = bus.sampleRate * delayMaxTimeSec;
  delayLine.ensureSize(delayLineLength);
}

export function stepDelay_processSamples(
  self: StepDelay,
  buffer: Float32Array,
) {
  const { bus, delayLine } = self;
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
