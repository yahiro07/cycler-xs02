import {
  DelayStep,
  GaterExSourceStride,
  GaterSourceStride,
  LoopBarsKey,
  PureStride,
} from "@core/base/parameter-defs";
import { m_pow } from "@core/utils/math-utils";
import { mapUnaryToInt } from "@core/utils/number-utils";

export function getLfoStepPeriod(lfoRate: number, lfoRateStepped: boolean) {
  let k = 0;
  if (lfoRateStepped) {
    k = mapUnaryToInt(1 - lfoRate, 0, 6);
  } else {
    k = (1 - lfoRate) * 6;
  }
  return m_pow(2, k);
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

export function getLoopBarsFromKey(bars: LoopBarsKey): number {
  return {
    [LoopBarsKey.bar1]: 1,
    [LoopBarsKey.bar2]: 2,
    [LoopBarsKey.bar4]: 4,
  }[bars];
}
