import {
  DelayStep,
  GaterExSourceStride,
  GaterSourceStride,
  PureStride,
} from "@/base/parameters";
import { mapUnaryToInt } from "@/logic/number-helper";

export function getLfoStepPeriod(lfoRate: number, lfoRateStepped: boolean) {
  let k = 0;
  if (lfoRateStepped) {
    k = mapUnaryToInt(1 - lfoRate, 0, 6);
  } else {
    k = (1 - lfoRate) * 6;
  }
  return Math.pow(2, k);
}

export function getStepPeriod(stride: PureStride): number {
  return {
    [PureStride.div16]: 1,
    [PureStride.div8]: 2,
    [PureStride.div4]: 4,
    [PureStride.div2]: 8,
    [PureStride.mul1]: 16,
    [PureStride.mul2]: 32,
    [PureStride.mul4]: 64,
  }[stride];
}

export function getStepPeriodForDelay(step: DelayStep): number {
  return {
    [DelayStep.div16]: 1,
    [DelayStep.div8]: 2,
    [DelayStep.div4]: 4,
  }[step];
}

export function getStepPeriodForExGater(stride: GaterExSourceStride): number {
  return {
    [GaterExSourceStride.div16]: 1,
    [GaterExSourceStride.div8]: 2,
    [GaterExSourceStride.div4]: 4,
    [GaterExSourceStride.div2]: 8,
    [GaterExSourceStride.mul1]: 16,
  }[stride];
}

export function getStepPeriodForGaterMain(stride: GaterSourceStride): number {
  return {
    [GaterSourceStride.div16]: 1,
    [GaterSourceStride.div8]: 2,
    [GaterSourceStride.div4]: 4,
  }[stride];
}
