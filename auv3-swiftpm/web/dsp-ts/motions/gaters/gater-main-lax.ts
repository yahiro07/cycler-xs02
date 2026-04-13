import { debugEmitError } from "@dsp/base/konsole";
import { Bus } from "@dsp/base/synthesis-bus";
import { getStepPeriodForGaterMain } from "@dsp/motions/funcs/steps-common";
import { StepRampCode } from "@dsp/motions/gaters/ramp-types";
import { seqNumbers } from "@dsp/utils/arrays";
import { m_random } from "@dsp/utils/math-utils";

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
    const idx = (m_random() * (stepLength - 1)) >>> 0;
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
  const sp = bus.parameters;
  const gs = bus.moduleLocals.gaterMainLax as GaterMainLaxState;
  gs.stepRampCodes.fill(StepRampCode.one);
  const stepLength = bus.loopBars * 16;
  if (sp.gaterRndTieOn) {
    placeRandomTwoCellCodes(gs.stepRampCodes, stepLength, sp.gaterRndTieCover);
  }
}

export function gaterMinLaxMode_setupLocalState(bus: Bus): void {
  bus.moduleLocals.gaterMainLax ??= createGaterMainLaxState();
}
export function gaterMinLaxMode_cleanupLocalState(bus: Bus): void {
  bus.moduleLocals.gaterMainLax = undefined;
}

export function gaterMinLaxMode_getRampCodeCached(
  bus: Bus,
  stepPos: number,
): StepRampCode {
  const gaterState = bus.moduleLocals.gaterMainLax as GaterMainLaxState;
  const gp = bus.parameters;
  const period = getStepPeriodForGaterMain(gp.gaterStride);
  let scaledStep = stepPos / period;

  if (scaledStep >= 64) {
    debugEmitError("stepPos >= 64");
    scaledStep = 0;
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
