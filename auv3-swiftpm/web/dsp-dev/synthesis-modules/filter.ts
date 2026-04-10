import { Bus } from "@core/base/synthesis-bus";
import { midiToFrequency } from "@core/dsp-modules/basic/synthesis-helper";
import {
  createFilterBiquadLp12,
  IFilter,
} from "@core/dsp-modules/filters/filter-biquad-lp12";
import { clampValue, invPower2, mapUnaryTo } from "@core/utils/number-utils";

export type Filter = {
  bus: Bus;
  filterBiquadLp12: IFilter;
};

export function createFilter(bus: Bus): Filter {
  const filterBiquadLp12 = createFilterBiquadLp12(bus.sampleRate);
  return { bus, filterBiquadLp12 };
}

function calculateNormalizedCutoffFreq(
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

export function filter_reset(self: Filter) {
  self.filterBiquadLp12.reset();
}

export function filter_processSamples(self: Filter, buffer: Float32Array) {
  const { bus, filterBiquadLp12 } = self;
  const { sp, interm } = bus;
  if (!sp.filterOn) return;
  const prCutoff = interm.pmxFilterPrCutoff;
  const cutoffNormFreq = calculateNormalizedCutoffFreq(
    bus.noteNumber,
    prCutoff,
    bus.sampleRate,
  );
  const prPeak = sp.filterPeak;
  filterBiquadLp12.processSamples(buffer, cutoffNormFreq, prCutoff, prPeak);
}
