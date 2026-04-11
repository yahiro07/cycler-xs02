import { GateSequencerCode } from "@core/base/parameter-defs";
import { StepRampCode } from "@core/base/ramp-types";
import { Bus } from "@core/base/synthesis-bus";
import { getStepPeriodForGaterMain } from "@core/motions/funcs/steps-common";

export function getRampCodeFromEx2PatternBits(
  patternBits: number,
  index: number,
): StepRampCode {
  const revIndex = 15 - index;
  const p = (patternBits >> revIndex) & 0b1;
  const pNext =
    revIndex > 0 ? (patternBits >> (revIndex - 1)) & 0b1 : undefined;
  if (pNext === 1) {
    return StepRampCode.tie1;
  } else if (p === 1) {
    return StepRampCode.tie2;
  } else {
    return StepRampCode.one;
  }
}

const ex2PatternMap = [
  //0 is ON, 1 is tie
  0b0000, //code0 oooo
  0b0001, //code1 ooo>
  0b0010, //code2 oo>o
  0b0100, //code3 o>oo
  0b1000, //code4 >ooo
  0b1001, //code5 >oo>
];

export function mapCodesToBits(codes: GateSequencerCode[]): number {
  let res = 0;
  for (let i = 0; i < 4; i++) {
    const pattern = ex2PatternMap[codes[i]];
    const shift = (3 - i) * 4;
    res |= pattern << shift;
  }
  return res;
}

function getBit(value: number, bitPos: number) {
  return (value >> bitPos) & 0b1;
}
function setBit(value: number, bitPos: number, bit: number) {
  return (value & ~(1 << bitPos)) | (bit << bitPos);
}
export function replaceContinuousTiesN(pattern: number): number {
  // If there is a sequence of tie like 011, replace it with 010
  // It is safe to assume that there are no patterns in the input where tie appears three or more times in a row
  for (let i = 0; i < 16; i++) {
    const p0 = 15 - i;
    const p1 = 14 - i;
    const b0 = getBit(pattern, p0);
    const b1 = getBit(pattern, p1);
    if (b0 === 1 && b1 === 1) {
      pattern = setBit(pattern, p1, 0);
    }
  }
  return pattern;
}

export function gaterMainSeqMode_getRampCode(
  bus: Bus,
  stepPos: number,
): StepRampCode {
  const gp = bus.sp;
  const stepPeriod = getStepPeriodForGaterMain(gp.gaterStride);
  const scaledStep = stepPos / stepPeriod;
  const index = (scaledStep % 16) >>> 0;
  let bits = mapCodesToBits(gp.gaterSeqPatterns);
  bits = replaceContinuousTiesN(bits);
  return getRampCodeFromEx2PatternBits(bits, index);
}
