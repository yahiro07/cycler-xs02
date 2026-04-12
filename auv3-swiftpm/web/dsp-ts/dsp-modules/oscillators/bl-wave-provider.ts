import {
  calculateWaveFrameSize,
  readWaveFrameInterpolated,
} from "@dsp/dsp-modules/oscillators/wave-frame-helper";
import { seqNumbers } from "@dsp/utils/arrays";
import { m_floor, m_pi, m_sin, m_two_pi } from "@dsp/utils/math-utils";
import { clampValue } from "@dsp/utils/number-utils";

export enum BlWaveWaveform {
  saw,
  rect,
  tri,
  sine,
}

function findIndexFromLast(item: number[], cond: (item: number) => boolean) {
  for (let i = item.length - 1; i >= 0; i--) {
    if (cond(item[i])) {
      return i;
    }
  }
  return -1;
}

function buildWaveFrameTable(
  tableHarmonicsSeries: number[],
  fn: (x: number, h: number) => number,
) {
  return tableHarmonicsSeries.map((h) => {
    const waveFrameSize = calculateWaveFrameSize(h);
    const buffer = new Float32Array(waveFrameSize);
    for (let i = 0; i < waveFrameSize; i++) {
      const x = (i / waveFrameSize) * m_two_pi;
      buffer[i] = fn(x, h);
    }
    return buffer;
  });
}

export type BlWave = {
  initialized: boolean;
  waveFrameTables: {
    [BlWaveWaveform.saw]: Float32Array[];
    [BlWaveWaveform.rect]: Float32Array[];
    [BlWaveWaveform.tri]: Float32Array[];
  };
  tableIndexMapper: number[];
  numHarmonicsMax: number;
};

export function createBlWave(): BlWave {
  return {
    initialized: false,
    waveFrameTables: {
      [BlWaveWaveform.saw]: [],
      [BlWaveWaveform.rect]: [],
      [BlWaveWaveform.tri]: [],
    },
    tableIndexMapper: [],
    numHarmonicsMax: 0,
  };
}

export function blWave_buildWaveTables(self: BlWave) {
  if (self.initialized) return;

  const tableHarmonicsSeries = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26,
    29, 32, 37, 42, 48, 56, 64, 81, 102, 128, 181, 256, 362, 512, 724, 1024,
    1448, 2048, 2896, 4096,
  ];

  const waveFrameTables = {
    [BlWaveWaveform.saw]: buildWaveFrameTable(
      tableHarmonicsSeries,
      (x, h) => {
        let value = 0;
        for (let k = 1; k <= h; k++) {
          const sign = k % 2 === 0 ? 1 : -1;
          value += (sign * m_sin(k * (x + m_pi))) / k;
        }
        return value * (2 / m_pi);
      },
    ),
    [BlWaveWaveform.rect]: buildWaveFrameTable(
      tableHarmonicsSeries,
      (x, n) => {
        let value = 0;
        for (let k = 1; k <= n; k += 2) {
          const y = (1 / k) * m_sin(k * x);
          value += y;
        }
        return value * (4 / m_pi);
      },
    ),
    [BlWaveWaveform.tri]: buildWaveFrameTable(
      tableHarmonicsSeries,
      (x, n) => {
        let value = 0;
        let harmonicIndex = 0;
        for (let k = 1; k <= n; k += 2) {
          const sign = harmonicIndex % 2 === 0 ? 1 : -1;
          const y = sign * (1 / (k * k)) * m_sin(k * x);
          value += y;
          harmonicIndex++;
        }
        return value * (8 / (m_pi * m_pi)); // Scale to [-1, 1] range
      },
    ),
  };

  const numHarmonicsMax = tableHarmonicsSeries[tableHarmonicsSeries.length - 1];

  const tableIndexMapper = seqNumbers(numHarmonicsMax + 1).map((nh) => {
    const idx = findIndexFromLast(tableHarmonicsSeries, (h) => h <= nh);
    return idx === -1 ? 0 : idx;
  });

  self.waveFrameTables = waveFrameTables;
  self.tableIndexMapper = tableIndexMapper;
  self.numHarmonicsMax = numHarmonicsMax;
  self.initialized = true;
}

function blWave_getWaveformSample(
  self: BlWave,
  waveform: BlWaveWaveform,
  pp: number,
  normFreq: number,
) {
  if (!self.initialized) return 0;
  const { waveFrameTables, tableIndexMapper, numHarmonicsMax } = self;
  if (waveform === BlWaveWaveform.sine) {
    return m_sin(pp * m_two_pi);
  }
  pp -= m_floor(pp);
  const nh = clampValue((0.45 / normFreq) >> 0, 1, numHarmonicsMax);
  const ti = tableIndexMapper[nh];
  const waveFrame = waveFrameTables[waveform][ti];
  return readWaveFrameInterpolated(waveFrame, waveFrame.length, pp);
}


class BlWaveProvider {
  private blWaveInstance: BlWave = createBlWave();

  setupTables() {
    blWave_buildWaveTables(this.blWaveInstance);
  }
  //In Safari on iOS, calling time-consuming operations within a Worklet slows down subsequent operations,
  //so the waveform table is created on the main thread and injected
  setBlWaveInstance(blWave: BlWave) {
    this.blWaveInstance = blWave;
  }

  getWaveformSample(waveform: BlWaveWaveform,
    pp: number,
    normFreq: number) {
    return blWave_getWaveformSample(this.blWaveInstance, waveform, pp, normFreq);
  }

}
export const blWaveProvider = new BlWaveProvider();