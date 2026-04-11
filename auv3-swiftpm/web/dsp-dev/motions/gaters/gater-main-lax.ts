import { Bus } from "@core/base/synthesis-bus";
import { StepRampCode } from "@core/base/synthesis-types";
import { randF } from "@core/dsp-modules/basic/parameters-helper";
import { getStepPeriodForGaterMain } from "@core/motions/funcs/steps-common";
import { seqNumbers } from "@core/utils/arrays";

type GaterMainLaxState = {
  stepRampCodes: StepRampCode[];
  stepCellsKeys: {
    gaterRndTieOn: boolean | undefined;
    gaterRndTieCover: number | undefined;
    loopSeed: number | undefined;
  };
};

function createGaterMainLaxState(): GaterMainLaxState {
  return {
    stepRampCodes: seqNumbers(64).map(() => StepRampCode.one),
    stepCellsKeys: {
      gaterRndTieOn: undefined,
      gaterRndTieCover: undefined,
      loopSeed: undefined,
    },
  };
}

function placeRandomTwoCellCodes(
  stepRampCodes: StepRampCode[],
  stepLength: number,
  cover: number,
) {
  const maxNum = (stepLength / 2) * cover;
  const trialRate = 2;
  let num = 0;
  for (let i = 0; i < maxNum * trialRate; i++) {
    const idx = (randF() * (stepLength - 1)) >>> 0;
    if (
      !(
        stepRampCodes[idx] === StepRampCode.one &&
        stepRampCodes[idx + 1] === StepRampCode.one
      )
    ) {
      continue;
    }
    stepRampCodes[idx] = StepRampCode.tie1;
    stepRampCodes[idx + 1] = StepRampCode.tie2;
    num++;
    if (num >= maxNum) {
      break;
    }
  }
}

// Function for verifying random pattern tests
export function gaterMainLax_testGenerateStepRampCodes(
  stepLength: number,
  cover: number,
): StepRampCode[] {
  const stepRampCodes = seqNumbers(stepLength).map(() => StepRampCode.one);
  placeRandomTwoCellCodes(stepRampCodes, stepLength, cover);
  return stepRampCodes;
}

function updateStepCellCodes(bus: Bus) {
  const gp = bus.sp;
  const gs = bus.moduleLocals.gaterMainLax as GaterMainLaxState;
  gs.stepRampCodes.fill(StepRampCode.one);
  const stepLength = gp.loopBars * 16;
  if (gp.gaterRndTieOn) {
    placeRandomTwoCellCodes(gs.stepRampCodes, stepLength, gp.gaterRndTieCover);
  }
}

export function gaterMinLaxMode_setupLocalState(bus: Bus): void {
  bus.moduleLocals.gaterMainLax ??= createGaterMainLaxState();
}

export function gaterMinLaxMode_getRampCodeCached(
  bus: Bus,
  stepPos: number,
): StepRampCode {
  const gaterState = bus.moduleLocals.gaterMainLax as GaterMainLaxState;
  const gp = bus.sp;
  const period = getStepPeriodForGaterMain(gp.gaterStride);
  const scaledStep = stepPos / period;

  console.assert(scaledStep < 64);
  if (scaledStep >= 64) {
    // debugger;
    throw new Error("stepPos >= 64");
  }
  const gsk = gaterState.stepCellsKeys;
  if (
    !(
      gp.gaterRndTieOn === gsk.gaterRndTieOn &&
      gp.gaterRndTieCover === gsk.gaterRndTieCover &&
      bus.loopSeed === gsk.loopSeed
    )
  ) {
    updateStepCellCodes(bus);
    gsk.gaterRndTieOn = gp.gaterRndTieOn;
    gsk.gaterRndTieCover = gp.gaterRndTieCover;
    gsk.loopSeed = bus.loopSeed;
  }
  return gaterState.stepRampCodes[scaledStep >>> 0];
}
