import { Bus } from "@core/base/synthesis-bus";
import { Delay } from "@core/synthesis-modules/delay";
import { Filter } from "@core/synthesis-modules/filter";
import { Oscillators } from "@core/synthesis-modules/oscillators";
import { Phaser } from "@core/synthesis-modules/phaser";
import { Shaper } from "@core/synthesis-modules/shaper";
import { StepDelay } from "@core/synthesis-modules/step-delay";
import { VoicingAmp } from "@core/synthesis-modules/voicing-amp";

export class MainSynthesisLine {
  private oscillators: Oscillators;
  private filter: Filter;
  private voicingAmp: VoicingAmp;
  private shaper: Shaper;
  private phaser: Phaser;
  private delay: Delay;
  private stepDelay: StepDelay;

  constructor(bus: Bus) {
    this.oscillators = new Oscillators(bus);
    this.filter = new Filter(bus);
    this.voicingAmp = new VoicingAmp(bus);
    this.shaper = new Shaper(bus);
    this.phaser = new Phaser(bus);
    this.delay = new Delay(bus);
    this.stepDelay = new StepDelay(bus);
  }

  prepare() {
    this.oscillators.prepare();
    this.shaper.prepare();
    this.delay.prepare();
    this.stepDelay.prepare();
  }

  reset() {
    this.oscillators.reset();
    this.filter.reset();
    this.voicingAmp.reset();
  }

  processSamples(buffer: Float32Array) {
    this.oscillators.processSamples(buffer);
    this.filter.processSamples(buffer);
    this.shaper.processSamples(buffer);
    this.voicingAmp.processSamples(buffer);
    this.phaser.processSamples(buffer);
    this.delay.processSamples(buffer);
    this.stepDelay.processSamples(buffer);
  }
}
