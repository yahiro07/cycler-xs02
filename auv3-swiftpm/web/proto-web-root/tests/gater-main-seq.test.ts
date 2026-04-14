import { GateSequencerCode } from "@dsp/base/parameter-defs";
import { StepRampCode } from "@dsp/motions/gaters/ramp-types";

import { describe, expect, it } from "vitest";
import { gaterMainSeq_testExports } from "@dsp/motions/gaters/gater-main-seq";

const {
  getRampCodeFromEx2PatternBits,
  mapCodesToBits,
  replaceContinuousTiesN,
} = gaterMainSeq_testExports;

describe("_mapCodesToBits", () => {
  it("should return the correct number", () => {
    const bits = mapCodesToBits([
      GateSequencerCode.code0,
      GateSequencerCode.code1,
      GateSequencerCode.code2,
      GateSequencerCode.code3,
    ]);
    expect(bits).toBe(0b0000_0001_0010_0100);
  });
});

describe("_replaceContinuousTiesN", () => {
  it("should return the correct number", () => {
    {
      const bits = replaceContinuousTiesN(0b0100_1100_0100_0010);
      expect(bits).toBe(0b0100_1000_0100_0010);
    }
    {
      const bits = replaceContinuousTiesN(0b0100_1001_1000_0010);
      expect(bits).toBe(0b0100_1001_0000_0010);
    }
  });
});

describe("_getRampCodeFromEx2PatternBits", () => {
  it("should return the correct ramp code", () => {
    {
      const rampCode = getRampCodeFromEx2PatternBits(0b0100_1100_0100_0010, 0);
      expect(rampCode).toBe(StepRampCode.tie1);
    }
    {
      const rampCode = getRampCodeFromEx2PatternBits(0b0100_1100_0100_0010, 1);
      expect(rampCode).toBe(StepRampCode.tie2);
    }
    {
      const rampCode = getRampCodeFromEx2PatternBits(0b0100_1100_0100_0010, 2);
      expect(rampCode).toBe(StepRampCode.one);
    }
    {
      const rampCode = getRampCodeFromEx2PatternBits(0b0100_1100_0100_0010, 3);
      expect(rampCode).toBe(StepRampCode.tie1);
    }
  });
});
