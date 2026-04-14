// import { produce } from "immer";
// import { seqNumbers } from "@/utils/arrays";
// import { filterChangedFields, getObjectKeys } from "@/utils/general-utils";
// import {
//   fisherYatesShuffle,
//   randB,
//   randChoice,
//   randChoiceWeightedI,
//   randF,
//   randFR,
// } from "@/ax/mo/parameters-helper";
// import {
//   bassPresetKeys,
//   bassTailAccentPatternKeys,
//   delayStepValues,
//   exGaterCodeValues,
//   exGaterCodeValuesForHead,
//   GaterSourceStride,
//   gaterExSourceStrideValues,
//   gaterTypeValues,
//   gateSequencerCodeValues,
//   gateSequencerCodeValuesForHead,
//   kickPresetKeys,
//   lfoWaveValues,
//   MotionParams,
//   moEgWaveValues,
//   moRndModeValues,
//   moTypeValues,
//   motionStrideValues,
//   OscUnisonMode,
//   oscColorModeValues,
//   oscPitchModeValues,
//   oscWaveValues,
//   SynthParametersSuit,
//   shaperModeValues,
// } from "@/base/parameter-defs";

// type ParamsRV = {
//   [K in keyof SynthParametersSuit]?: () => SynthParametersSuit[K];
// };

// type ParamsPartRV<_P extends string> = {
//   [K in keyof SynthParametersSuit]?: () => SynthParametersSuit[K];
// };

// type ParamsPartRVM = {
//   [K in keyof MotionParams]: () => MotionParams[K];
// };

// const oscRV: ParamsPartRV<"osc"> = {
//   oscOn: () => true,
//   oscWave: () => randChoice(oscWaveValues),
//   oscPitch: () => randF(),
//   oscPitchMode: () => randChoice(oscPitchModeValues),
//   oscPitchMoSmooth: () => randB(),
//   oscOctave: () => randChoice([-1, 0, 1]),
//   oscColor: () => randF(),
//   oscColorMode: () => randChoice(oscColorModeValues),
//   oscUnisonMode: () =>
//     randChoiceWeightedI<OscUnisonMode>({
//       [OscUnisonMode.one]: 4,
//       [OscUnisonMode.det2]: 1,
//       [OscUnisonMode.det3]: 1,
//       [OscUnisonMode.sub]: 1,
//       [OscUnisonMode.fifth]: 1,
//     }),
//   oscUnisonDetune: () => randFR(0, 0.7),
// };

// const filterRV: ParamsPartRV<"filter"> = {
//   filterOn: () => randB(0.8),
//   filterCutoff: () => randFR(0.3, 1),
//   filterPeak: () => randF(),
// };

// const ampRV: ParamsPartRV<"amp"> = {
//   ampOn: () => randB(0.9),
//   ampEgHold: () => randFR(0, 0.9),
//   ampEgDecay: () => randFR(0, 0.8),
// };

// const shaperRV: ParamsPartRV<"shaper"> = {
//   shaperOn: () => randB(0.4),
//   shaperMode: () => randChoice(shaperModeValues),
//   shaperLevel: () => randF(),
// };

// const phaserRV: ParamsPartRV<"phaser"> = {
//   phaserOn: () => randB(0.4),
//   phaserLevel: () => randF(),
// };

// const delayRV: ParamsPartRV<"delay"> = {
//   delayOn: () => randB(0.4),
//   delayTime: () => randF(),
//   delayFeed: () => randF(),
// };

// const stepDelayRV: ParamsPartRV<"stepDelay"> = {
//   stepDelayOn: () => randB(0.35),
//   stepDelayStep: () => randChoice(delayStepValues),
//   stepDelayFeed: () => randF(),
//   stepDelayMix: () => randFR(0.2, 0.8),
// };

// const gaterRV: ParamsPartRV<"gater"> = {
//   // gaterStride: () =>
//   //   randChoiceWeighted({
//   //     "/16": 3,
//   //     "/8": 1,
//   //   }),
//   gaterStride: () => GaterSourceStride.div16,
//   gaterType: () => randChoice(gaterTypeValues),
//   gaterRndTieOn: () => randB(0.75),
//   gaterRndTieCover: () => randF(),
//   gaterSeqPatterns: () =>
//     seqNumbers(4).map((i) =>
//       randChoice(
//         i === 0 ? gateSequencerCodeValuesForHead : gateSequencerCodeValues,
//       ),
//     ),
//   exGaterSeqStride: () => randChoice(gaterExSourceStrideValues),
//   exGaterCodes: () =>
//     seqNumbers(4).map((i) =>
//       randChoice(i === 0 ? exGaterCodeValuesForHead : exGaterCodeValues),
//     ),
// };

// const kickRV: ParamsRV = {
//   kickPresetKey: () => randChoice(kickPresetKeys),
// };

// const bassRV: ParamsRV = {
//   bassPresetKey: () => randChoice(bassPresetKeys),
//   bassTailAccentPatternKey: () => randChoice(bassTailAccentPatternKeys),
// };

// const motionRV: ParamsPartRVM = {
//   moOn: () => randB(0.7),
//   moType: () => randChoice(moTypeValues),
//   moAmount: () => randF(),
//   rndStride: () => randChoice(motionStrideValues),
//   // rndStride: randChoiceWeighted({
//   //   gate: 6,
//   //   ex: 6,
//   //   "/16": 6,
//   //   "/8": 5,
//   //   "/4": 4,
//   //   "/2": 4,
//   //   "1": 2,
//   //   "2": 2,
//   //   "4": 1,
//   // }),
//   rndMode: () => randChoice(moRndModeValues),
//   rndCover: () => randF(),
//   lfoWave: () => randChoice(lfoWaveValues),
//   lfoRate: () => randF(),
//   lfoRateStepped: () => randB(),
//   lfoInvert: () => randB(0.3),
//   egStride: () => randChoice(motionStrideValues),
//   egWave: () => randChoice(moEgWaveValues),
//   egInvert: () => randB(0.3),
//   egCurve: () => randF(),
// };

// type RandomOp = (mps: SynthParametersSuit, forceChange: boolean) => boolean;

// type Swappers = {
//   [K in keyof SynthParametersSuit]?: () => SynthParametersSuit[K];
// };

// type ModuleOnFieldKey =
//   | "oscOn"
//   | "filterOn"
//   | "ampOn"
//   | "shaperOn"
//   | "phaserOn"
//   | "delayOn"
//   | "stepDelayOn"
//   | "kickOn"
//   | "bassOn";

// function createReplacers(
//   moduleOnFieldKey: ModuleOnFieldKey | undefined,
//   swappers: Swappers,
// ): RandomOp[] {
//   return getObjectKeys(swappers).map((key) => {
//     const op = swappers[key];
//     if (!op) return () => false;
//     return (mps: SynthParametersSuit, forceChange: boolean) => {
//       const isEffective =
//         moduleOnFieldKey === undefined ||
//         key === moduleOnFieldKey ||
//         (moduleOnFieldKey && mps[moduleOnFieldKey]) ||
//         forceChange;
//       const currentValue = mps[key];
//       const newValue = op();
//       if (newValue !== currentValue && isEffective) {
//         (mps as any)[key] = newValue;
//         return true;
//       }
//       return false;
//     };
//   });
// }

// function createMotionReplacers(
//   moKey:
//     | "moOscPitch"
//     | "moOscColor"
//     | "moFilterCutoff"
//     | "moShaperLevel"
//     | "moPhaserLevel"
//     | "moDelayTime",
//   moduleOnFieldKey: ModuleOnFieldKey,
// ): RandomOp[] {
//   return getObjectKeys(motionRV).map((key) => {
//     const op = motionRV[key];
//     return (mps: SynthParametersSuit, forceChange: boolean) => {
//       const mo = mps[moKey];
//       const isEffective =
//         (key === "moOn" && mps[moduleOnFieldKey]) ||
//         (mps[moduleOnFieldKey] && mo.moOn) ||
//         forceChange;
//       const currentValue = mo[key];
//       const newValue = op();
//       if (newValue !== currentValue && isEffective) {
//         (mo as any)[key] = newValue;
//         return true;
//       }
//       return false;
//     };
//   });
// }

// const randomOps: RandomOp[] = [
//   ...createReplacers("oscOn", oscRV),
//   ...createReplacers("filterOn", filterRV),
//   ...createReplacers("ampOn", ampRV),
//   ...createReplacers("shaperOn", shaperRV),
//   ...createReplacers("phaserOn", phaserRV),
//   ...createReplacers("delayOn", delayRV),
//   ...createReplacers("stepDelayOn", stepDelayRV),
//   ...createReplacers(undefined, gaterRV),
//   ...createMotionReplacers("moOscPitch", "oscOn"),
//   ...createMotionReplacers("moOscColor", "oscOn"),
//   ...createMotionReplacers("moFilterCutoff", "filterOn"),
//   ...createMotionReplacers("moShaperLevel", "shaperOn"),
//   ...createMotionReplacers("moPhaserLevel", "phaserOn"),
//   ...createMotionReplacers("moDelayTime", "delayOn"),
//   ...createReplacers("kickOn", kickRV),
//   ...createReplacers("bassOn", bassRV),
// ];

// export function createRandomParameters(
//   original: SynthParametersSuit,
//   numChanges: number, //-1 for full
// ): Partial<SynthParametersSuit> {
//   let indices = seqNumbers(randomOps.length);
//   let forceChange = false;
//   if (numChanges === -1) {
//     numChanges = randomOps.length;
//     forceChange = true;
//   }
//   indices = fisherYatesShuffle(indices);

//   const newParams = produce(original, (draft) => {
//     let numChanged = 0;
//     for (const index of indices) {
//       if (randomOps[index](draft, forceChange)) {
//         numChanged++;
//         if (numChanged >= numChanges) {
//           break;
//         }
//       }
//     }
//     if (draft.ampEgHold < 0.2 && draft.ampEgDecay < 0.2) {
//       draft.ampEgHold = randFR(0.2, 0.9);
//       draft.ampEgDecay = randFR(0.2, 0.9);
//     }
//   });
//   return filterChangedFields(original, newParams);
// }
