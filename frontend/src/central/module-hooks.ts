import { useCallback, useMemo } from "react";
import { MoEgWave } from "@/base/parameters";
import { getLfoStepPeriodDisplay } from "@/logic/additional";
import { getAmpEgCurvePL, getEgCurve } from "@/logic/eg-curves";

export function useAmpEgWaveFn(hold: number, decay: number) {
  return useCallback(
    (x: number) => {
      return getAmpEgCurvePL(x, hold, decay);
    },
    [hold, decay],
  );
}

export function useMoEgWaveFn(wave: MoEgWave, curve: number) {
  return useCallback(
    (x: number) => {
      return getEgCurve(wave, x, curve);
    },
    [wave, curve],
  );
}

export function useLfoStepPeriodDisplayText(rate: number, stepped: boolean) {
  return useMemo(() => {
    if (!stepped) return undefined;
    return getLfoStepPeriodDisplay(rate, stepped);
  }, [rate, stepped]);
}
