import { RandomizeLevel } from "@core/base/parameter-defs";
import { ParameterId } from "@core/base/parameter-id";
import { m_abs, m_random } from "@core/utils/math-utils";

const pk = ParameterId;

function toBool(value: number) {
  return value > 0.5;
}

function rand() {
  return (m_random() * 0xffffffff) >>> 0;
}

function randF() {
  return m_random();
}

function randB(onWeight = 0.5) {
  return randF() < onWeight ? 1 : 0;
}

function randI(n: number) {
  return rand() % n;
}

function randChoice(n: number) {
  return rand() % n;
}

function randIntRange(lo: number, hi: number) {
  return randI(hi - lo + 1) + lo;
}

function randFR(lo: number, hi: number) {
  return lo + randF() * (hi - lo);
}

function randChoiceWeightedI(n: number, weights: number[]) {
  let totalWeight = 0;
  for (let i = 0; i < n; i++) {
    totalWeight += weights[i];
  }
  const randomValue = randF() * totalWeight;
  let cumulativeWeight = 0;
  for (let i = 0; i < n; i++) {
    cumulativeWeight += weights[i];
    if (randomValue <= cumulativeWeight) {
      return i;
    }
  }
  return n - 1;
}

function buildEffectiveFlags(
  parameters: Record<number, number>,
): Record<number, boolean> {
  const activeStates = {
    osc: toBool(parameters[pk.oscOn]),
    filter: toBool(parameters[pk.filterOn]),
    amp: toBool(parameters[pk.ampOn]),
    shaper: toBool(parameters[pk.shaperOn]),
    phaser: toBool(parameters[pk.phaserOn]),
    delay: toBool(parameters[pk.delayOn]),
    stepDelay: toBool(parameters[pk.stepDelayOn]),
    moOscPitch: toBool(parameters[pk.moOscPitch_moOn]),
    moOscColor: toBool(parameters[pk.moOscColor_moOn]),
    moFilterCutoff: toBool(parameters[pk.moFilterCutoff_moOn]),
    moShaperLevel: toBool(parameters[pk.moShaperLevel_moOn]),
    moPhaserLevel: toBool(parameters[pk.moPhaserLevel_moOn]),
    moDelayTime: toBool(parameters[pk.moDelayTime_moOn]),
    kick: toBool(parameters[pk.kickOn]),
    bass: toBool(parameters[pk.bassOn]),
  };
  const effectiveFlags: Record<number, boolean> = {};
  const ac = activeStates;
  const ef = effectiveFlags;

  ef[pk.oscOn] = true;
  ef[pk.oscWave] =
    ef[pk.oscOctave] =
    ef[pk.oscPitch] =
    ef[pk.oscPitchMode] =
    ef[pk.oscPitchMoSmooth] =
    ef[pk.oscColor] =
    ef[pk.oscColorMode] =
    ef[pk.oscUnisonMode] =
    ef[pk.oscUnisonDetune] =
      ac.osc;

  ef[pk.filterOn] = true;
  ef[pk.filterCutoff] = ef[pk.filterPeak] = ac.filter;

  ef[pk.ampOn] = true;
  ef[pk.ampEgHold] = ef[pk.ampEgDecay] = ac.amp;

  ef[pk.shaperOn] = true;
  ef[pk.shaperMode] = ef[pk.shaperLevel] = ac.shaper;

  ef[pk.phaserOn] = true;
  ef[pk.phaserLevel] = ac.phaser;

  ef[pk.delayOn] = true;
  ef[pk.delayTime] = ef[pk.delayFeed] = ac.delay;

  ef[pk.stepDelayOn] = true;
  ef[pk.stepDelayStep] =
    ef[pk.stepDelayFeed] =
    ef[pk.stepDelayMix] =
      ac.stepDelay;

  ef[pk.gaterStride] =
    ef[pk.gaterType] =
    ef[pk.gaterRndTieOn] =
    ef[pk.gaterRndTieCover] =
    ef[pk.exGaterSeqStride] =
      true;
  ef[pk.gaterSeqPatterns_0] =
    ef[pk.gaterSeqPatterns_1] =
    ef[pk.gaterSeqPatterns_2] =
    ef[pk.gaterSeqPatterns_3] =
      true;
  ef[pk.exGaterCodes_0] =
    ef[pk.exGaterCodes_1] =
    ef[pk.exGaterCodes_2] =
    ef[pk.exGaterCodes_3] =
      true;

  ef[pk.kickOn] = true;
  ef[pk.kickPresetKey] = ac.kick;

  ef[pk.bassOn] = true;
  ef[pk.bassPresetKey] = ac.bass;
  ef[pk.bassTailAccentPatternKey] = ac.bass;

  ef[pk.moOscPitch_moOn] = ac.osc;
  ef[pk.moOscPitch_moAmount] =
    ef[pk.moOscPitch_moType] =
    ef[pk.moOscPitch_rndStride] =
    ef[pk.moOscPitch_rndMode] =
    ef[pk.moOscPitch_rndCover] =
    ef[pk.moOscPitch_lfoWave] =
    ef[pk.moOscPitch_lfoRate] =
    ef[pk.moOscPitch_lfoRateStepped] =
    ef[pk.moOscPitch_lfoInvert] =
    ef[pk.moOscPitch_egStride] =
    ef[pk.moOscPitch_egWave] =
    ef[pk.moOscPitch_egCurve] =
    ef[pk.moOscPitch_egInvert] =
      ac.moOscPitch && ac.osc;

  ef[pk.moOscColor_moOn] = ac.osc;
  ef[pk.moOscColor_moAmount] =
    ef[pk.moOscColor_moType] =
    ef[pk.moOscColor_rndStride] =
    ef[pk.moOscColor_rndMode] =
    ef[pk.moOscColor_rndCover] =
    ef[pk.moOscColor_lfoWave] =
    ef[pk.moOscColor_lfoRate] =
    ef[pk.moOscColor_lfoRateStepped] =
    ef[pk.moOscColor_lfoInvert] =
    ef[pk.moOscColor_egStride] =
    ef[pk.moOscColor_egWave] =
    ef[pk.moOscColor_egCurve] =
    ef[pk.moOscColor_egInvert] =
      ac.moOscColor && ac.osc;

  ef[pk.moFilterCutoff_moOn] = ac.filter;
  ef[pk.moFilterCutoff_moAmount] =
    ef[pk.moFilterCutoff_moType] =
    ef[pk.moFilterCutoff_rndStride] =
    ef[pk.moFilterCutoff_rndMode] =
    ef[pk.moFilterCutoff_rndCover] =
    ef[pk.moFilterCutoff_lfoWave] =
    ef[pk.moFilterCutoff_lfoRate] =
    ef[pk.moFilterCutoff_lfoRateStepped] =
    ef[pk.moFilterCutoff_lfoInvert] =
    ef[pk.moFilterCutoff_egStride] =
    ef[pk.moFilterCutoff_egWave] =
    ef[pk.moFilterCutoff_egCurve] =
    ef[pk.moFilterCutoff_egInvert] =
      ac.moFilterCutoff && ac.filter;

  ef[pk.moShaperLevel_moOn] = ac.shaper;
  ef[pk.moShaperLevel_moAmount] =
    ef[pk.moShaperLevel_moType] =
    ef[pk.moShaperLevel_rndStride] =
    ef[pk.moShaperLevel_rndMode] =
    ef[pk.moShaperLevel_rndCover] =
    ef[pk.moShaperLevel_lfoWave] =
    ef[pk.moShaperLevel_lfoRate] =
    ef[pk.moShaperLevel_lfoRateStepped] =
    ef[pk.moShaperLevel_lfoInvert] =
    ef[pk.moShaperLevel_egStride] =
    ef[pk.moShaperLevel_egWave] =
    ef[pk.moShaperLevel_egCurve] =
    ef[pk.moShaperLevel_egInvert] =
      ac.moShaperLevel && ac.shaper;

  ef[pk.moPhaserLevel_moOn] = ac.phaser;
  ef[pk.moPhaserLevel_moAmount] =
    ef[pk.moPhaserLevel_moType] =
    ef[pk.moPhaserLevel_rndStride] =
    ef[pk.moPhaserLevel_rndMode] =
    ef[pk.moPhaserLevel_rndCover] =
    ef[pk.moPhaserLevel_lfoWave] =
    ef[pk.moPhaserLevel_lfoRate] =
    ef[pk.moPhaserLevel_lfoRateStepped] =
    ef[pk.moPhaserLevel_lfoInvert] =
    ef[pk.moPhaserLevel_egStride] =
    ef[pk.moPhaserLevel_egWave] =
    ef[pk.moPhaserLevel_egCurve] =
    ef[pk.moPhaserLevel_egInvert] =
      ac.moPhaserLevel && ac.phaser;

  ef[pk.moDelayTime_moOn] = ac.delay;
  ef[pk.moDelayTime_moAmount] =
    ef[pk.moDelayTime_moType] =
    ef[pk.moDelayTime_rndStride] =
    ef[pk.moDelayTime_rndMode] =
    ef[pk.moDelayTime_rndCover] =
    ef[pk.moDelayTime_lfoWave] =
    ef[pk.moDelayTime_lfoRate] =
    ef[pk.moDelayTime_lfoRateStepped] =
    ef[pk.moDelayTime_lfoInvert] =
    ef[pk.moDelayTime_egStride] =
    ef[pk.moDelayTime_egWave] =
    ef[pk.moDelayTime_egCurve] =
    ef[pk.moDelayTime_egInvert] =
      ac.moDelayTime && ac.delay;

  return ef;
}

function buildParameterIdsRandomOrder(
  parameters: Record<number, number>,
): number[] {
  const paramIds = Object.keys(parameters).map((id) => Number(id));
  return paramIds.sort(() => m_random() - 0.5);
}

const divisions = {
  oscWave: 4,
  oscPitchMode: 8,
  oscColorMode: 8,
  oscUnisonMode: 5,
  shaperMode: 5,
  stepDelayStep: 3,
  gaterType: 2,
  gaterExSourceStride: 5,
  gateSequencerCode: 6,
  gateSequencerCodeForHead: 4,
  exGaterCode: 4,
  exGaterCodeForHead: 3,
  moType: 3,
  moRndMode: 3,
  moLfoWave: 4,
  moEgWave: 6,
  moRndStride: 9,
  moEgStride: 9,
  kickPresetKey: 5,
  bassPresetKey: 4,
  bassTailAccentPatternKey: 5,
  loopBars: 3,
};

const detuneModeWeights = [
  4, // one
  1, // det2
  1, // det3
  1, // sub
  1, // 5th
];

function getRandomParameterValue(paramId: number): number {
  switch (paramId) {
    case pk.moOscPitch_moOn:
    case pk.moOscColor_moOn:
    case pk.moFilterCutoff_moOn:
    case pk.moShaperLevel_moOn:
    case pk.moPhaserLevel_moOn:
    case pk.moDelayTime_moOn:
      return randB(0.7);
    case pk.moOscPitch_moAmount:
    case pk.moOscColor_moAmount:
    case pk.moFilterCutoff_moAmount:
    case pk.moShaperLevel_moAmount:
    case pk.moPhaserLevel_moAmount:
    case pk.moDelayTime_moAmount:
      return randF();
    case pk.moOscPitch_moType:
    case pk.moOscColor_moType:
    case pk.moFilterCutoff_moType:
    case pk.moShaperLevel_moType:
    case pk.moPhaserLevel_moType:
    case pk.moDelayTime_moType:
      return randChoice(divisions.moType);
    case pk.moOscPitch_rndStride:
    case pk.moOscColor_rndStride:
    case pk.moFilterCutoff_rndStride:
    case pk.moShaperLevel_rndStride:
    case pk.moPhaserLevel_rndStride:
    case pk.moDelayTime_rndStride:
      return randChoice(divisions.moRndStride);
    case pk.moOscPitch_rndMode:
    case pk.moOscColor_rndMode:
    case pk.moFilterCutoff_rndMode:
    case pk.moShaperLevel_rndMode:
    case pk.moPhaserLevel_rndMode:
    case pk.moDelayTime_rndMode:
      return randChoice(divisions.moRndMode);
    case pk.moOscPitch_rndCover:
    case pk.moOscColor_rndCover:
    case pk.moFilterCutoff_rndCover:
    case pk.moShaperLevel_rndCover:
    case pk.moPhaserLevel_rndCover:
    case pk.moDelayTime_rndCover:
      return randF();
    case pk.moOscPitch_lfoWave:
    case pk.moOscColor_lfoWave:
    case pk.moFilterCutoff_lfoWave:
    case pk.moShaperLevel_lfoWave:
    case pk.moPhaserLevel_lfoWave:
    case pk.moDelayTime_lfoWave:
      return randChoice(divisions.moLfoWave);
    case pk.moOscPitch_lfoRate:
    case pk.moOscColor_lfoRate:
    case pk.moFilterCutoff_lfoRate:
    case pk.moShaperLevel_lfoRate:
    case pk.moPhaserLevel_lfoRate:
    case pk.moDelayTime_lfoRate:
      return randF();
    case pk.moOscPitch_lfoRateStepped:
    case pk.moOscColor_lfoRateStepped:
    case pk.moFilterCutoff_lfoRateStepped:
    case pk.moShaperLevel_lfoRateStepped:
    case pk.moPhaserLevel_lfoRateStepped:
    case pk.moDelayTime_lfoRateStepped:
      return randB();
    case pk.moOscPitch_lfoInvert:
    case pk.moOscColor_lfoInvert:
    case pk.moFilterCutoff_lfoInvert:
    case pk.moShaperLevel_lfoInvert:
    case pk.moPhaserLevel_lfoInvert:
    case pk.moDelayTime_lfoInvert:
      return randB(0.3);
    case pk.moOscPitch_egStride:
    case pk.moOscColor_egStride:
    case pk.moFilterCutoff_egStride:
    case pk.moShaperLevel_egStride:
    case pk.moPhaserLevel_egStride:
    case pk.moDelayTime_egStride:
      return randChoice(divisions.moEgStride);
    case pk.moOscPitch_egWave:
    case pk.moOscColor_egWave:
    case pk.moFilterCutoff_egWave:
    case pk.moShaperLevel_egWave:
    case pk.moPhaserLevel_egWave:
    case pk.moDelayTime_egWave:
      return randChoice(divisions.moEgWave);
    case pk.moOscPitch_egCurve:
    case pk.moOscColor_egCurve:
    case pk.moFilterCutoff_egCurve:
    case pk.moShaperLevel_egCurve:
    case pk.moPhaserLevel_egCurve:
    case pk.moDelayTime_egCurve:
      return randF();
    case pk.moOscPitch_egInvert:
    case pk.moOscColor_egInvert:
    case pk.moFilterCutoff_egInvert:
    case pk.moShaperLevel_egInvert:
    case pk.moPhaserLevel_egInvert:
    case pk.moDelayTime_egInvert:
      return randB(0.3);
  }

  switch (paramId) {
    case pk.oscOn:
      return 1; // fixed to on
    case pk.oscWave:
      return randChoice(divisions.oscWave);
    case pk.oscPitch:
      return randF();
    case pk.oscPitchMode:
      return randChoice(divisions.oscPitchMode);
    case pk.oscPitchMoSmooth:
      return randB();
    case pk.oscOctave:
      return randIntRange(-1, 1);
    case pk.oscColor:
      return randF();
    case pk.oscColorMode:
      return randChoice(divisions.oscColorMode);
    case pk.oscUnisonMode:
      return randChoiceWeightedI(divisions.oscUnisonMode, detuneModeWeights);
    case pk.oscUnisonDetune:
      return randFR(0, 0.7);
    //
    case pk.filterOn:
      return randB(0.8);
    case pk.filterCutoff:
      return randFR(0.3, 1);
    case pk.filterPeak:
      return randF();
    //
    case pk.ampOn:
      return randB(0.9);
    case pk.ampEgHold:
      return randFR(0, 0.9);
    case pk.ampEgDecay:
      return randFR(0, 0.8);
    //
    case pk.shaperOn:
      return randB(0.4);
    case pk.shaperMode:
      return randChoice(divisions.shaperMode);
    case pk.shaperLevel:
      return randF();
    //
    case pk.phaserOn:
      return randB(0.4);
    case pk.phaserLevel:
      return randF();
    //
    case pk.delayOn:
      return randB(0.4);
    case pk.delayTime:
      return randF();
    case pk.delayFeed:
      return randF();
    //
    case pk.stepDelayOn:
      return randB(0.35);
    case pk.stepDelayStep:
      return randChoice(divisions.stepDelayStep);
    case pk.stepDelayFeed:
      return randF();
    case pk.stepDelayMix:
      return randFR(0.2, 0.8);
    //
    case pk.gaterStride:
      return 0; // fixed to /16
    case pk.gaterType:
      return randChoice(divisions.gaterType);
    case pk.gaterRndTieOn:
      return randB(0.75);
    case pk.gaterRndTieCover:
      return randF();
    case pk.exGaterSeqStride:
      return randChoice(divisions.gaterExSourceStride);
    case pk.gaterSeqPatterns_0:
      return randChoice(divisions.gateSequencerCodeForHead);
    case pk.gaterSeqPatterns_1:
      return randChoice(divisions.gateSequencerCode);
    case pk.gaterSeqPatterns_2:
      return randChoice(divisions.gateSequencerCode);
    case pk.gaterSeqPatterns_3:
      return randChoice(divisions.gateSequencerCode);
    case pk.exGaterCodes_0:
      return randChoice(divisions.exGaterCodeForHead);
    case pk.exGaterCodes_1:
      return randChoice(divisions.exGaterCode);
    case pk.exGaterCodes_2:
      return randChoice(divisions.exGaterCode);
    case pk.exGaterCodes_3:
      return randChoice(divisions.exGaterCode);

    case pk.kickPresetKey:
      return randChoice(divisions.kickPresetKey);
    case pk.bassPresetKey:
      return randChoice(divisions.bassPresetKey);
    case pk.bassTailAccentPatternKey:
      return randChoice(divisions.bassTailAccentPatternKey);
  }
  return -1;
}

function randomizeParameters(
  parameters: Record<number, number>,
  randomCount: number,
) {
  const numParameters = Object.keys(parameters).length;
  if (randomCount === -1) {
    randomCount = numParameters;
  }
  const effectiveFlags = buildEffectiveFlags(parameters);
  const parameterIds = buildParameterIdsRandomOrder(parameters);

  let changedCount = 0;
  for (let i = 0; i < numParameters; i++) {
    const id = parameterIds[i];
    if (!effectiveFlags[id]) continue;
    const currentValue = parameters[id];
    const newValue = getRandomParameterValue(id);
    if (newValue === -1) continue;
    if (m_abs(newValue - currentValue) < 1e-6) continue;
    parameters[id] = newValue;
    changedCount++;
    if (changedCount >= randomCount) break;
  }

  if (parameters[pk.ampEgHold] < 0.2 && parameters[pk.ampEgDecay] < 0.2) {
    parameters[pk.ampEgHold] = randFR(0.2, 0.9);
    parameters[pk.ampEgDecay] = randFR(0.2, 0.9);
  }
}

function getParameterRandomCount(randomizeLevel: RandomizeLevel) {
  return {
    [RandomizeLevel.rnd1]: 1,
    [RandomizeLevel.rnd2]: 2,
    [RandomizeLevel.rnd5]: 5,
    [RandomizeLevel.rnd10]: 10,
    [RandomizeLevel.rnd20]: 20,
    [RandomizeLevel.rndFull]: -1,
  }[randomizeLevel];
}

export function applyRandomizeParameters(
  parameters: Record<number, number>,
): void {
  const randomizeLevel =
    parameters[pk.randomizeLevel] ?? RandomizeLevel.rndFull;
  const randomCount = getParameterRandomCount(randomizeLevel);
  randomizeParameters(parameters, randomCount);
}
