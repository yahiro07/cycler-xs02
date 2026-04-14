import { useMemo } from "react";
import {
  GaterExSourceStride,
  GaterSourceStride,
  MoType,
  MotionStride,
  PureStride,
} from "@/base/parameters";
import {
  MotionPresenter,
  MotionSpeedSource,
} from "@/central/motion-core-hooks";
import { mixMotionPartValues } from "@/logic/motion-mux";
import { calcStepTimeSec } from "@/logic/sequence-helper";
import { getLfoStepPeriod, getStepPeriod } from "@/logic/steps-common";

function getCoreStepPeriod(
  stride: MotionStride,
  gaterStride: GaterSourceStride,
  exGaterSeqStride: GaterExSourceStride,
) {
  let sd: number = stride;
  if (stride === MotionStride.ex) {
    sd = exGaterSeqStride;
  } else if (stride === MotionStride.gate) {
    sd = gaterStride;
  }
  return getStepPeriod(sd as PureStride);
}

function getMotionStepPeriod(
  mo: MotionPresenter,
  gaterStride: GaterSourceStride,
  exGaterSeqStride: GaterExSourceStride,
) {
  if (mo.moType === MoType.rnd) {
    return getCoreStepPeriod(mo.rndStride, gaterStride, exGaterSeqStride);
  } else if (mo.moType === MoType.eg) {
    return getCoreStepPeriod(mo.egStride, gaterStride, exGaterSeqStride);
  } else {
    //lfo
    return getLfoStepPeriod(mo.lfoRate, mo.lfoRateStepped);
  }
}

export function useMoSpinSpeed(
  mo: MotionPresenter,
  speedSource: MotionSpeedSource,
  moduleOnCondition: boolean,
) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: deps are used in nested function
  return useMemo(() => {
    const { playing, gaterStride, exGaterSeqStride, bpm } = speedSource;
    if (!(moduleOnCondition && playing && mo.moOn)) return 0;
    const stepPeriod = getMotionStepPeriod(mo, gaterStride, exGaterSeqStride);
    const time = calcStepTimeSec(stepPeriod, bpm);
    return time * 2;
  }, [
    mo.moOn,
    mo.moType,
    mo.rndStride,
    mo.egStride,
    mo.lfoRate,
    mo.lfoRateStepped,
    speedSource,
    moduleOnCondition,
  ]);
}

export function useMotionTargetArcRange(
  mo: MotionPresenter,
  knobValue: number,
): [number, number] | undefined {
  return useMemo(() => {
    if (!mo.moOn) return undefined;

    const envMod = mo.moType === MoType.eg ? mo.moAmount : 0;
    const lfoDepth = mo.moType === MoType.lfo ? mo.moAmount : 0;
    const rndRange = mo.moType === MoType.rnd ? mo.moAmount : 0;
    const hi = mixMotionPartValues({
      egLevel: 1,
      envMod,
      lfoOut: 1,
      lfoDepth,
      rndOut: 1,
      rndRange,
      knobValue,
      muxScaling: 1,
    });
    const lo = mixMotionPartValues({
      egLevel: 0,
      envMod,
      lfoOut: 0,
      lfoDepth,
      rndOut: 0,
      rndRange,
      knobValue,
      muxScaling: 1,
    });
    return [lo, hi];
  }, [mo, knobValue]);
}
