import { useMemo } from "react";
import {
  GaterExSourceStride,
  GaterSourceStride,
  LfoWave,
  MoEgWave,
  MoId,
  MoRndMode,
  MoType,
  MotionStride,
  ParameterKey,
} from "@/base/parameters";
import { store } from "@/central/store";
import { capitalizeFirstLetter } from "@/utils/general-utils";

export type MotionPresenter = {
  moOn: boolean;
  moType: MoType;
  moAmount: number;
  rndStride: MotionStride;
  rndMode: MoRndMode;
  rndCover: number;
  lfoWave: LfoWave;
  lfoRate: number;
  lfoRateStepped: boolean;
  lfoInvert: boolean;
  egStride: MotionStride;
  egWave: MoEgWave;
  egCurve: number;
  egInvert: boolean;
  toggleMoOn(): void;
  setMoType(type: MoType): void;
  setMoAmount(value: number): void;
  setRndStride(value: MotionStride): void;
  setRndMode(value: MoRndMode): void;
  setRndCover(value: number): void;
  setLfoWave(value: LfoWave): void;
  setLfoRate(value: number): void;
  toggleLfoRateStepped(): void;
  toggleLfoInvert(): void;
  setEgStride(value: MotionStride): void;
  setEgWave(value: MoEgWave): void;
  setEgCurve(value: number): void;
  toggleEgInvert(): void;
};

export function useMotionPresenter(moId: MoId): MotionPresenter {
  const {
    [`${moId}_moOn`]: moOn,
    [`${moId}_moType`]: moType,
    [`${moId}_moAmount`]: moAmount,
    [`${moId}_rndStride`]: rndStride,
    [`${moId}_rndMode`]: rndMode,
    [`${moId}_rndCover`]: rndCover,
    [`${moId}_lfoWave`]: lfoWave,
    [`${moId}_lfoRate`]: lfoRate,
    [`${moId}_lfoRateStepped`]: lfoRateStepped,
    [`${moId}_lfoInvert`]: lfoInvert,
    [`${moId}_egStride`]: egStride,
    [`${moId}_egWave`]: egWave,
    [`${moId}_egCurve`]: egCurve,
    [`${moId}_egInvert`]: egInvert,
    // biome-ignore lint/suspicious/noExplicitAny: manually fulfill type
  } = store.useSnapshot() as any;
  const moIdC = capitalizeFirstLetter(moId);
  const {
    [`set${moIdC}_moOn`]: setMoOn,
    [`set${moIdC}_moType`]: setMoType,
    [`set${moIdC}_moAmount`]: setMoAmount,
    [`set${moIdC}_rndStride`]: setRndStride,
    [`set${moIdC}_rndMode`]: setRndMode,
    [`set${moIdC}_rndCover`]: setRndCover,
    [`set${moIdC}_lfoWave`]: setLfoWave,
    [`set${moIdC}_lfoRate`]: setLfoRate,
    [`set${moIdC}_lfoRateStepped`]: setLfoRateStepped,
    [`set${moIdC}_lfoInvert`]: setLfoInvert,
    [`set${moIdC}_egStride`]: setEgStride,
    [`set${moIdC}_egWave`]: setEgWave,
    [`set${moIdC}_egCurve`]: setEgCurve,
    [`set${moIdC}_egInvert`]: setEgInvert,
    // biome-ignore lint/suspicious/noExplicitAny: manually fulfill type
  } = store.mutations as any;
  return {
    moOn,
    moType,
    moAmount,
    rndStride,
    rndMode,
    rndCover,
    lfoWave,
    lfoRate,
    lfoRateStepped,
    lfoInvert,
    egStride,
    egWave,
    egCurve,
    egInvert,
    toggleMoOn: () => setMoOn(!moOn),
    setMoType,
    setMoAmount,
    setRndStride,
    setRndMode,
    setRndCover,
    setLfoWave,
    setLfoRate,
    toggleLfoRateStepped: () => setLfoRateStepped(!lfoRateStepped),
    toggleLfoInvert: () => setLfoInvert(!lfoInvert),
    setEgStride,
    setEgWave,
    setEgCurve,
    toggleEgInvert: () => setEgInvert(!egInvert),
  };
}

export type MotionParameterKeys = {
  moOn: ParameterKey;
  moType: ParameterKey;
  moAmount: ParameterKey;
  rndStride: ParameterKey;
  rndMode: ParameterKey;
  rndCover: ParameterKey;
  lfoWave: ParameterKey;
  lfoRate: ParameterKey;
  lfoRateStepped: ParameterKey;
  lfoInvert: ParameterKey;
  egStride: ParameterKey;
  egWave: ParameterKey;
  egCurve: ParameterKey;
  egInvert: ParameterKey;
};

export function useMotionParameterKeys(moId: MoId): MotionParameterKeys {
  return useMemo(() => {
    return {
      moOn: `${moId}_moOn`,
      moType: `${moId}_moType`,
      moAmount: `${moId}_moAmount`,
      rndStride: `${moId}_rndStride`,
      rndMode: `${moId}_rndMode`,
      rndCover: `${moId}_rndCover`,
      lfoWave: `${moId}_lfoWave`,
      lfoRate: `${moId}_lfoRate`,
      lfoRateStepped: `${moId}_lfoRateStepped`,
      lfoInvert: `${moId}_lfoInvert`,
      egStride: `${moId}_egStride`,
      egWave: `${moId}_egWave`,
      egCurve: `${moId}_egCurve`,
      egInvert: `${moId}_egInvert`,
    } as unknown as MotionParameterKeys;
  }, [moId]);
}

export type MotionSpeedSource = {
  gaterStride: GaterSourceStride;
  exGaterSeqStride: GaterExSourceStride;
  bpm: number;
  playing: boolean;
};

export function useMotionSpeedSource(): MotionSpeedSource {
  const {
    gaterStride,
    internalBpm,
    groovePlaying,
    hostNoteNumber,
    exGaterSeqStride,
  } = store.useSnapshot();
  return useMemo(() => {
    const bpm = internalBpm;
    const playing = groovePlaying || hostNoteNumber !== -1;
    return { gaterStride, bpm, playing, exGaterSeqStride };
  }, [
    gaterStride,
    internalBpm,
    groovePlaying,
    hostNoteNumber,
    exGaterSeqStride,
  ]);
}
