import { LfoWave, OscWave } from "@/base/parameters";

export const oscWaveFunctions = {
  [OscWave.saw]: (x) => 1 - x,
  [OscWave.rect]: (x) => (x < 0.5 ? 1 : 0),
  [OscWave.tri]: (x) => (x < 0.5 ? 2 * x : 2 * (1 - x)),
  [OscWave.sine]: (x) => 0.5 - Math.cos(x * Math.PI * 2) * 0.5,
} satisfies Record<LfoWave, (x: number) => number>;

export const lfoWaveFunctions = {
  [LfoWave.sine]: (x) => 0.5 - Math.cos(x * Math.PI * 2) * 0.5,
  [LfoWave.rect]: (x) => (x < 0.5 ? 1 : 0),
  [LfoWave.tri]: (x) => (x < 0.5 ? 2 * x : 2 * (1 - x)),
  [LfoWave.saw]: (x) => 1 - x,
} satisfies Record<LfoWave, (x: number) => number>;
