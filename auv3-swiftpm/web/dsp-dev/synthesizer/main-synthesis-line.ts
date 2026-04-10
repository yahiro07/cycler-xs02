import { Bus } from "@core/base/synthesis-bus";
import {
  createDelay,
  Delay,
  delay_prepare,
  delay_processSamples,
} from "@core/synthesis-modules/delay";
import {
  createFilter,
  Filter,
  filter_processSamples,
  filter_reset,
} from "@core/synthesis-modules/filter";
import {
  createOscillators,
  Oscillators,
  oscillators_prepare,
  oscillators_processSamples,
  oscillators_reset,
} from "@core/synthesis-modules/oscillators";
import {
  createPhaser,
  Phaser,
  phaser_processSamples,
} from "@core/synthesis-modules/phaser";
import {
  createShaper,
  Shaper,
  shaper_prepare,
  shaper_processSamples,
} from "@core/synthesis-modules/shaper";
import {
  createStepDelay,
  StepDelay,
  stepDelay_prepare,
  stepDelay_processSamples,
} from "@core/synthesis-modules/step-delay";
import {
  createVoicingAmp,
  VoicingAmp,
  voicingAmp_processSamples,
  voicingAmp_reset,
} from "@core/synthesis-modules/voicing-amp";

export type MainSynthesisLine = {
  bus: Bus;
  oscillators: Oscillators;
  filter: Filter;
  voicingAmp: VoicingAmp;
  shaper: Shaper;
  phaser: Phaser;
  delay: Delay;
  stepDelay: StepDelay;
};

export function createMainSynthesisLine(bus: Bus): MainSynthesisLine {
  const oscillators = createOscillators(bus);
  const filter = createFilter(bus);
  const voicingAmp = createVoicingAmp(bus);
  const shaper = createShaper(bus);
  const phaser = createPhaser(bus);
  const delay = createDelay(bus);
  const stepDelay = createStepDelay(bus);
  return {
    bus,
    oscillators,
    filter,
    voicingAmp,
    shaper,
    phaser,
    delay,
    stepDelay,
  };
}

export function mainSynthesisLine_prepare(self: MainSynthesisLine) {
  oscillators_prepare(self.oscillators);
  shaper_prepare(self.shaper);
  delay_prepare(self.delay);
  stepDelay_prepare(self.stepDelay);
}

export function mainSynthesisLine_reset(self: MainSynthesisLine) {
  oscillators_reset(self.oscillators);
  filter_reset(self.filter);
  voicingAmp_reset(self.voicingAmp);
}

export function mainSynthesisLine_processSamples(
  self: MainSynthesisLine,
  buffer: Float32Array,
) {
  oscillators_processSamples(self.oscillators, buffer);
  filter_processSamples(self.filter, buffer);
  shaper_processSamples(self.shaper, buffer);
  voicingAmp_processSamples(self.voicingAmp, buffer);
  phaser_processSamples(self.phaser, buffer);
  delay_processSamples(self.delay, buffer);
  stepDelay_processSamples(self.stepDelay, buffer);
}
