import { Bus } from "@dsp/base/synthesis-bus";
import { midiToFrequency } from "@dsp/dsp-modules/basic/synthesis-helper";
import {
  createFilterBiquadLp12,
  IFilter,
} from "@dsp/dsp-modules/filters/filter-biquad-lp12";
import { clampValue, invPower2, mapUnaryTo } from "@dsp/utils/number-utils";

export class Filter {
  private bus: Bus;
  private filterBiquadLp12: IFilter;

  constructor(bus: Bus) {
    this.bus = bus;
    this.filterBiquadLp12 = createFilterBiquadLp12(bus.sampleRate);
  }

  reset() {
    this.filterBiquadLp12.reset();
  }

  private calculateNormalizedCutoffFreq(
    noteNumber: number,
    prCutoff: number,
    sampleRate: number,
  ) {
    const bottomNoteNumber = noteNumber - 6;
    let topNoteNumber = 132;
    if (1) {
      topNoteNumber = 124;
    }
    const cutoffNotePitch = mapUnaryTo(
      invPower2(prCutoff),
      bottomNoteNumber,
      topNoteNumber,
    );
    const cutoffNormFreq = midiToFrequency(cutoffNotePitch) / sampleRate;
    return clampValue(cutoffNormFreq, 0.0, 0.49);
  }

  processSamples(buffer: Float32Array) {
    const { sp, interm } = this.bus;
    if (!sp.filterOn) return;
    const prCutoff = interm.pmxFilterPrCutoff;
    const cutoffNormFreq = this.calculateNormalizedCutoffFreq(
      this.bus.noteNumber,
      prCutoff,
      this.bus.sampleRate,
    );
    const prPeak = sp.filterPeak;
    this.filterBiquadLp12.processSamples(
      buffer,
      cutoffNormFreq,
      prCutoff,
      prPeak,
    );
  }
}
