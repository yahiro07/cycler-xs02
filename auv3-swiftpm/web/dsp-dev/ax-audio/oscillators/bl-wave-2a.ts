import { seqNumbers } from "@core/ax/arrays";
import { clampValue } from "@core/ax/number-utils";
import {
  calculateWaveFrameSize,
  readWaveFrameInterpolated,
} from "@core/ax-audio/oscillators/wave-frame-helper";

export enum BlWave2AWaveform {
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
      const x = (i / waveFrameSize) * 2.0 * Math.PI;
      buffer[i] = fn(x, h);
    }
    return buffer;
  });
}

export type BlWave2A = {
  initialized: boolean;
  waveFrameTables: {
    [BlWave2AWaveform.saw]: Float32Array[];
    [BlWave2AWaveform.rect]: Float32Array[];
    [BlWave2AWaveform.tri]: Float32Array[];
  };
  tableIndexMapper: number[];
  numHarmonicsMax: number;
};

export function createBlWave2A(): BlWave2A {
  return {
    initialized: false,
    waveFrameTables: {
      [BlWave2AWaveform.saw]: [],
      [BlWave2AWaveform.rect]: [],
      [BlWave2AWaveform.tri]: [],
    },
    tableIndexMapper: [],
    numHarmonicsMax: 0,
  };
}

export function blWave2A_buildWaveTables(self: BlWave2A) {
  const tableHarmonicsSeries = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26,
    29, 32, 37, 42, 48, 56, 64, 81, 102, 128, 181, 256, 362, 512, 724, 1024,
    1448, 2048, 2896, 4096,
  ];

  const waveFrameTables = {
    [BlWave2AWaveform.saw]: buildWaveFrameTable(
      tableHarmonicsSeries,
      (x, h) => {
        if (0) {
          let value = 0;
          for (let k = 1; k <= h; k++) {
            const sign = k % 2 === 0 ? -1 : 1;
            const y = sign * (2 / k) * Math.sin(k * (x + Math.PI));
            //位相ゼロで立ち上げるとこの部分でスパイクが出やすいので、中央で立ち上がるようにする
            // const y = sign * (2 / k) * Math.sin(k * x);
            value += y * 0.25;
          }
          return -value;
        } else {
          //標準的な鋸波の式
          let value = 0;
          for (let k = 1; k <= h; k++) {
            const sign = k % 2 === 0 ? 1 : -1;
            value += (sign * Math.sin(k * (x + Math.PI))) / k;
          }
          return value * (2 / Math.PI);
        }
      },
    ),
    [BlWave2AWaveform.rect]: buildWaveFrameTable(
      tableHarmonicsSeries,
      (x, n) => {
        let value = 0;
        for (let k = 1; k <= n; k += 2) {
          const y = (1 / k) * Math.sin(k * x);
          value += y;
        }
        return value * (4 / Math.PI);
      },
    ),
    [BlWave2AWaveform.tri]: buildWaveFrameTable(
      tableHarmonicsSeries,
      (x, n) => {
        let value = 0;
        let harmonicIndex = 0;
        for (let k = 1; k <= n; k += 2) {
          const sign = harmonicIndex % 2 === 0 ? 1 : -1;
          const y = sign * (1 / (k * k)) * Math.sin(k * x);
          value += y;
          harmonicIndex++;
        }
        return value * (8 / (Math.PI * Math.PI)); // Scale to [-1, 1] range
      },
    ),
  };

  const numHarmonicsMax = tableHarmonicsSeries.at(-1)!;

  const tableIndexMapper = seqNumbers(numHarmonicsMax + 1).map((nh) => {
    const idx = findIndexFromLast(tableHarmonicsSeries, (h) => h <= nh);
    return idx === -1 ? 0 : idx;
  });

  self.waveFrameTables = waveFrameTables;
  self.tableIndexMapper = tableIndexMapper;
  self.numHarmonicsMax = numHarmonicsMax;
  self.initialized = true;
}

export function blWave2A_getWaveformSample(
  self: BlWave2A,
  waveform: BlWave2AWaveform,
  pp: number,
  normFreq: number,
) {
  if (!self.initialized) return 0;
  const { waveFrameTables, tableIndexMapper, numHarmonicsMax } = self;
  if (waveform === BlWave2AWaveform.sine) {
    return Math.sin(pp * Math.PI * 2);
  }
  pp -= Math.floor(pp);
  const nh = clampValue((0.45 / normFreq) >> 0, 1, numHarmonicsMax);
  const ti = tableIndexMapper[nh];
  return readWaveFrameInterpolated(waveFrameTables[waveform][ti], pp);
}
