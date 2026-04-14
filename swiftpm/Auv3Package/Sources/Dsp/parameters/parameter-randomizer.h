#pragma once
#include "../base/parameter-defs.h"
#include "../base/parameter-id.h"
#include "../utils/math-utils.h"
#include <algorithm>
#include <map>
#include <random>
#include <unordered_map>
#include <vector>

namespace dsp {

namespace {

inline bool toBool(float value) { return value > 0.5f; }

inline uint32_t rand_u32() {
  return static_cast<uint32_t>(m_random() * 0xFFFFFFFFull);
}

inline float randF() { return m_random(); }

inline int randB(float onWeight = 0.5f) { return randF() < onWeight ? 1 : 0; }

inline int randI(int n) { return rand_u32() % n; }

inline int randChoice(int n) { return rand_u32() % n; }

inline int randIntRange(int lo, int hi) { return randI(hi - lo + 1) + lo; }

inline float randFR(float lo, float hi) { return lo + randF() * (hi - lo); }

inline int randChoiceWeightedI(int n, const float *weights) {
  float totalWeight = 0.0f;
  for (int i = 0; i < n; i++) {
    totalWeight += weights[i];
  }
  const float randomValue = randF() * totalWeight;
  float cumulativeWeight = 0.0f;
  for (int i = 0; i < n; i++) {
    cumulativeWeight += weights[i];
    if (randomValue <= cumulativeWeight) {
      return i;
    }
  }
  return n - 1;
}

struct Divisions {
  static constexpr int oscWave = 4;
  static constexpr int oscPitchMode = 8;
  static constexpr int oscColorMode = 8;
  static constexpr int oscUnisonMode = 5;
  static constexpr int shaperMode = 5;
  static constexpr int stepDelayStep = 3;
  static constexpr int gaterType = 2;
  static constexpr int gaterExSourceStride = 5;
  static constexpr int gateSequencerCode = 6;
  static constexpr int gateSequencerCodeForHead = 4;
  static constexpr int exGaterCode = 4;
  static constexpr int exGaterCodeForHead = 3;
  static constexpr int moType = 3;
  static constexpr int moRndMode = 3;
  static constexpr int moLfoWave = 4;
  static constexpr int moEgWave = 6;
  static constexpr int moRndStride = 9;
  static constexpr int moEgStride = 9;
  static constexpr int kickPresetKey = 5;
  static constexpr int bassPresetKey = 4;
  static constexpr int bassTailAccentPatternKey = 5;
  static constexpr int loopBars = 3;
};

static const float detuneModeWeights[] = {4.0f, 1.0f, 1.0f, 1.0f, 1.0f};

inline std::unordered_map<ParameterId, bool>
buildEffectiveFlags(const std::unordered_map<ParameterId, float> &parameters) {
  const auto get = [&](ParameterId id) -> float {
    auto it = parameters.find(id);
    return (it != parameters.end()) ? it->second : 0.0f;
  };

  struct ActiveStates {
    bool osc;
    bool filter;
    bool amp;
    bool shaper;
    bool phaser;
    bool delay;
    bool stepDelay;
    bool moOscPitch;
    bool moOscColor;
    bool moFilterCutoff;
    bool moShaperLevel;
    bool moPhaserLevel;
    bool moDelayTime;
    bool kick;
    bool bass;
  } ac;

  ac.osc = toBool(get(ParameterId::oscOn));
  ac.filter = toBool(get(ParameterId::filterOn));
  ac.amp = toBool(get(ParameterId::ampOn));
  ac.shaper = toBool(get(ParameterId::shaperOn));
  ac.phaser = toBool(get(ParameterId::phaserOn));
  ac.delay = toBool(get(ParameterId::delayOn));
  ac.stepDelay = toBool(get(ParameterId::stepDelayOn));
  ac.moOscPitch = toBool(get(ParameterId::moOscPitch_moOn));
  ac.moOscColor = toBool(get(ParameterId::moOscColor_moOn));
  ac.moFilterCutoff = toBool(get(ParameterId::moFilterCutoff_moOn));
  ac.moShaperLevel = toBool(get(ParameterId::moShaperLevel_moOn));
  ac.moPhaserLevel = toBool(get(ParameterId::moPhaserLevel_moOn));
  ac.moDelayTime = toBool(get(ParameterId::moDelayTime_moOn));
  ac.kick = toBool(get(ParameterId::kickOn));
  ac.bass = toBool(get(ParameterId::bassOn));

  std::unordered_map<ParameterId, bool> ef;

  ef[ParameterId::oscOn] = true;
  ef[ParameterId::oscWave] = ac.osc;
  ef[ParameterId::oscOctave] = ac.osc;
  ef[ParameterId::oscPitch] = ac.osc;
  ef[ParameterId::oscPitchMode] = ac.osc;
  ef[ParameterId::oscPitchMoSmooth] = ac.osc;
  ef[ParameterId::oscColor] = ac.osc;
  ef[ParameterId::oscColorMode] = ac.osc;
  ef[ParameterId::oscUnisonMode] = ac.osc;
  ef[ParameterId::oscUnisonDetune] = ac.osc;

  ef[ParameterId::filterOn] = true;
  ef[ParameterId::filterCutoff] = ac.filter;
  ef[ParameterId::filterPeak] = ac.filter;

  ef[ParameterId::ampOn] = true;
  ef[ParameterId::ampEgHold] = ac.amp;
  ef[ParameterId::ampEgDecay] = ac.amp;

  ef[ParameterId::shaperOn] = true;
  ef[ParameterId::shaperMode] = ac.shaper;
  ef[ParameterId::shaperLevel] = ac.shaper;

  ef[ParameterId::phaserOn] = true;
  ef[ParameterId::phaserLevel] = ac.phaser;

  ef[ParameterId::delayOn] = true;
  ef[ParameterId::delayTime] = ac.delay;
  ef[ParameterId::delayFeed] = ac.delay;

  ef[ParameterId::stepDelayOn] = true;
  ef[ParameterId::stepDelayStep] = ac.stepDelay;
  ef[ParameterId::stepDelayFeed] = ac.stepDelay;
  ef[ParameterId::stepDelayMix] = ac.stepDelay;

  ef[ParameterId::gaterStride] = true;
  ef[ParameterId::gaterType] = true;
  ef[ParameterId::gaterRndTieOn] = true;
  ef[ParameterId::gaterRndTieCover] = true;
  ef[ParameterId::exGaterSeqStride] = true;
  ef[ParameterId::gaterSeqPatterns_0] = true;
  ef[ParameterId::gaterSeqPatterns_1] = true;
  ef[ParameterId::gaterSeqPatterns_2] = true;
  ef[ParameterId::gaterSeqPatterns_3] = true;
  ef[ParameterId::exGaterCodes_0] = true;
  ef[ParameterId::exGaterCodes_1] = true;
  ef[ParameterId::exGaterCodes_2] = true;
  ef[ParameterId::exGaterCodes_3] = true;

  ef[ParameterId::kickOn] = true;
  ef[ParameterId::kickPresetKey] = ac.kick;

  ef[ParameterId::bassOn] = true;
  ef[ParameterId::bassPresetKey] = ac.bass;
  ef[ParameterId::bassTailAccentPatternKey] = ac.bass;

  // Motion parameters - oscPitch
  ef[ParameterId::moOscPitch_moOn] = ac.osc;
  ef[ParameterId::moOscPitch_moAmount] = ac.moOscPitch && ac.osc;
  ef[ParameterId::moOscPitch_moType] = ac.moOscPitch && ac.osc;
  ef[ParameterId::moOscPitch_rndStride] = ac.moOscPitch && ac.osc;
  ef[ParameterId::moOscPitch_rndMode] = ac.moOscPitch && ac.osc;
  ef[ParameterId::moOscPitch_rndCover] = ac.moOscPitch && ac.osc;
  ef[ParameterId::moOscPitch_lfoWave] = ac.moOscPitch && ac.osc;
  ef[ParameterId::moOscPitch_lfoRate] = ac.moOscPitch && ac.osc;
  ef[ParameterId::moOscPitch_lfoRateStepped] = ac.moOscPitch && ac.osc;
  ef[ParameterId::moOscPitch_lfoInvert] = ac.moOscPitch && ac.osc;
  ef[ParameterId::moOscPitch_egStride] = ac.moOscPitch && ac.osc;
  ef[ParameterId::moOscPitch_egWave] = ac.moOscPitch && ac.osc;
  ef[ParameterId::moOscPitch_egCurve] = ac.moOscPitch && ac.osc;
  ef[ParameterId::moOscPitch_egInvert] = ac.moOscPitch && ac.osc;

  // Motion parameters - oscColor
  ef[ParameterId::moOscColor_moOn] = ac.osc;
  ef[ParameterId::moOscColor_moAmount] = ac.moOscColor && ac.osc;
  ef[ParameterId::moOscColor_moType] = ac.moOscColor && ac.osc;
  ef[ParameterId::moOscColor_rndStride] = ac.moOscColor && ac.osc;
  ef[ParameterId::moOscColor_rndMode] = ac.moOscColor && ac.osc;
  ef[ParameterId::moOscColor_rndCover] = ac.moOscColor && ac.osc;
  ef[ParameterId::moOscColor_lfoWave] = ac.moOscColor && ac.osc;
  ef[ParameterId::moOscColor_lfoRate] = ac.moOscColor && ac.osc;
  ef[ParameterId::moOscColor_lfoRateStepped] = ac.moOscColor && ac.osc;
  ef[ParameterId::moOscColor_lfoInvert] = ac.moOscColor && ac.osc;
  ef[ParameterId::moOscColor_egStride] = ac.moOscColor && ac.osc;
  ef[ParameterId::moOscColor_egWave] = ac.moOscColor && ac.osc;
  ef[ParameterId::moOscColor_egCurve] = ac.moOscColor && ac.osc;
  ef[ParameterId::moOscColor_egInvert] = ac.moOscColor && ac.osc;

  // Motion parameters - filterCutoff
  ef[ParameterId::moFilterCutoff_moOn] = ac.filter;
  ef[ParameterId::moFilterCutoff_moAmount] = ac.moFilterCutoff && ac.filter;
  ef[ParameterId::moFilterCutoff_moType] = ac.moFilterCutoff && ac.filter;
  ef[ParameterId::moFilterCutoff_rndStride] = ac.moFilterCutoff && ac.filter;
  ef[ParameterId::moFilterCutoff_rndMode] = ac.moFilterCutoff && ac.filter;
  ef[ParameterId::moFilterCutoff_rndCover] = ac.moFilterCutoff && ac.filter;
  ef[ParameterId::moFilterCutoff_lfoWave] = ac.moFilterCutoff && ac.filter;
  ef[ParameterId::moFilterCutoff_lfoRate] = ac.moFilterCutoff && ac.filter;
  ef[ParameterId::moFilterCutoff_lfoRateStepped] =
      ac.moFilterCutoff && ac.filter;
  ef[ParameterId::moFilterCutoff_lfoInvert] = ac.moFilterCutoff && ac.filter;
  ef[ParameterId::moFilterCutoff_egStride] = ac.moFilterCutoff && ac.filter;
  ef[ParameterId::moFilterCutoff_egWave] = ac.moFilterCutoff && ac.filter;
  ef[ParameterId::moFilterCutoff_egCurve] = ac.moFilterCutoff && ac.filter;
  ef[ParameterId::moFilterCutoff_egInvert] = ac.moFilterCutoff && ac.filter;

  // Motion parameters - shaperLevel
  ef[ParameterId::moShaperLevel_moOn] = ac.shaper;
  ef[ParameterId::moShaperLevel_moAmount] = ac.moShaperLevel && ac.shaper;
  ef[ParameterId::moShaperLevel_moType] = ac.moShaperLevel && ac.shaper;
  ef[ParameterId::moShaperLevel_rndStride] = ac.moShaperLevel && ac.shaper;
  ef[ParameterId::moShaperLevel_rndMode] = ac.moShaperLevel && ac.shaper;
  ef[ParameterId::moShaperLevel_rndCover] = ac.moShaperLevel && ac.shaper;
  ef[ParameterId::moShaperLevel_lfoWave] = ac.moShaperLevel && ac.shaper;
  ef[ParameterId::moShaperLevel_lfoRate] = ac.moShaperLevel && ac.shaper;
  ef[ParameterId::moShaperLevel_lfoRateStepped] = ac.moShaperLevel && ac.shaper;
  ef[ParameterId::moShaperLevel_lfoInvert] = ac.moShaperLevel && ac.shaper;
  ef[ParameterId::moShaperLevel_egStride] = ac.moShaperLevel && ac.shaper;
  ef[ParameterId::moShaperLevel_egWave] = ac.moShaperLevel && ac.shaper;
  ef[ParameterId::moShaperLevel_egCurve] = ac.moShaperLevel && ac.shaper;
  ef[ParameterId::moShaperLevel_egInvert] = ac.moShaperLevel && ac.shaper;

  // Motion parameters - phaserLevel
  ef[ParameterId::moPhaserLevel_moOn] = ac.phaser;
  ef[ParameterId::moPhaserLevel_moAmount] = ac.moPhaserLevel && ac.phaser;
  ef[ParameterId::moPhaserLevel_moType] = ac.moPhaserLevel && ac.phaser;
  ef[ParameterId::moPhaserLevel_rndStride] = ac.moPhaserLevel && ac.phaser;
  ef[ParameterId::moPhaserLevel_rndMode] = ac.moPhaserLevel && ac.phaser;
  ef[ParameterId::moPhaserLevel_rndCover] = ac.moPhaserLevel && ac.phaser;
  ef[ParameterId::moPhaserLevel_lfoWave] = ac.moPhaserLevel && ac.phaser;
  ef[ParameterId::moPhaserLevel_lfoRate] = ac.moPhaserLevel && ac.phaser;
  ef[ParameterId::moPhaserLevel_lfoRateStepped] = ac.moPhaserLevel && ac.phaser;
  ef[ParameterId::moPhaserLevel_lfoInvert] = ac.moPhaserLevel && ac.phaser;
  ef[ParameterId::moPhaserLevel_egStride] = ac.moPhaserLevel && ac.phaser;
  ef[ParameterId::moPhaserLevel_egWave] = ac.moPhaserLevel && ac.phaser;
  ef[ParameterId::moPhaserLevel_egCurve] = ac.moPhaserLevel && ac.phaser;
  ef[ParameterId::moPhaserLevel_egInvert] = ac.moPhaserLevel && ac.phaser;

  // Motion parameters - delayTime
  ef[ParameterId::moDelayTime_moOn] = ac.delay;
  ef[ParameterId::moDelayTime_moAmount] = ac.moDelayTime && ac.delay;
  ef[ParameterId::moDelayTime_moType] = ac.moDelayTime && ac.delay;
  ef[ParameterId::moDelayTime_rndStride] = ac.moDelayTime && ac.delay;
  ef[ParameterId::moDelayTime_rndMode] = ac.moDelayTime && ac.delay;
  ef[ParameterId::moDelayTime_rndCover] = ac.moDelayTime && ac.delay;
  ef[ParameterId::moDelayTime_lfoWave] = ac.moDelayTime && ac.delay;
  ef[ParameterId::moDelayTime_lfoRate] = ac.moDelayTime && ac.delay;
  ef[ParameterId::moDelayTime_lfoRateStepped] = ac.moDelayTime && ac.delay;
  ef[ParameterId::moDelayTime_lfoInvert] = ac.moDelayTime && ac.delay;
  ef[ParameterId::moDelayTime_egStride] = ac.moDelayTime && ac.delay;
  ef[ParameterId::moDelayTime_egWave] = ac.moDelayTime && ac.delay;
  ef[ParameterId::moDelayTime_egCurve] = ac.moDelayTime && ac.delay;
  ef[ParameterId::moDelayTime_egInvert] = ac.moDelayTime && ac.delay;

  return ef;
}

inline std::vector<ParameterId> buildParameterIdsRandomOrder(
    const std::unordered_map<ParameterId, float> &parameters) {
  std::vector<ParameterId> paramIds;
  paramIds.reserve(parameters.size());
  for (const auto &[id, _] : parameters) {
    paramIds.push_back(id);
  }
  std::shuffle(paramIds.begin(), paramIds.end(),
               std::mt19937{std::random_device{}()});
  return paramIds;
}

inline float getRandomParameterValue(ParameterId paramId) {
  // Motion parameters common patterns
  switch (paramId) {
  case ParameterId::moOscPitch_moOn:
  case ParameterId::moOscColor_moOn:
  case ParameterId::moFilterCutoff_moOn:
  case ParameterId::moShaperLevel_moOn:
  case ParameterId::moPhaserLevel_moOn:
  case ParameterId::moDelayTime_moOn:
    return randB(0.7f);

  case ParameterId::moOscPitch_moAmount:
  case ParameterId::moOscColor_moAmount:
  case ParameterId::moFilterCutoff_moAmount:
  case ParameterId::moShaperLevel_moAmount:
  case ParameterId::moPhaserLevel_moAmount:
  case ParameterId::moDelayTime_moAmount:
    return randF();

  case ParameterId::moOscPitch_moType:
  case ParameterId::moOscColor_moType:
  case ParameterId::moFilterCutoff_moType:
  case ParameterId::moShaperLevel_moType:
  case ParameterId::moPhaserLevel_moType:
  case ParameterId::moDelayTime_moType:
    return randChoice(Divisions::moType);

  case ParameterId::moOscPitch_rndStride:
  case ParameterId::moOscColor_rndStride:
  case ParameterId::moFilterCutoff_rndStride:
  case ParameterId::moShaperLevel_rndStride:
  case ParameterId::moPhaserLevel_rndStride:
  case ParameterId::moDelayTime_rndStride:
    return randChoice(Divisions::moRndStride);

  case ParameterId::moOscPitch_rndMode:
  case ParameterId::moOscColor_rndMode:
  case ParameterId::moFilterCutoff_rndMode:
  case ParameterId::moShaperLevel_rndMode:
  case ParameterId::moPhaserLevel_rndMode:
  case ParameterId::moDelayTime_rndMode:
    return randChoice(Divisions::moRndMode);

  case ParameterId::moOscPitch_rndCover:
  case ParameterId::moOscColor_rndCover:
  case ParameterId::moFilterCutoff_rndCover:
  case ParameterId::moShaperLevel_rndCover:
  case ParameterId::moPhaserLevel_rndCover:
  case ParameterId::moDelayTime_rndCover:
    return randF();

  case ParameterId::moOscPitch_lfoWave:
  case ParameterId::moOscColor_lfoWave:
  case ParameterId::moFilterCutoff_lfoWave:
  case ParameterId::moShaperLevel_lfoWave:
  case ParameterId::moPhaserLevel_lfoWave:
  case ParameterId::moDelayTime_lfoWave:
    return randChoice(Divisions::moLfoWave);

  case ParameterId::moOscPitch_lfoRate:
  case ParameterId::moOscColor_lfoRate:
  case ParameterId::moFilterCutoff_lfoRate:
  case ParameterId::moShaperLevel_lfoRate:
  case ParameterId::moPhaserLevel_lfoRate:
  case ParameterId::moDelayTime_lfoRate:
    return randF();

  case ParameterId::moOscPitch_lfoRateStepped:
  case ParameterId::moOscColor_lfoRateStepped:
  case ParameterId::moFilterCutoff_lfoRateStepped:
  case ParameterId::moShaperLevel_lfoRateStepped:
  case ParameterId::moPhaserLevel_lfoRateStepped:
  case ParameterId::moDelayTime_lfoRateStepped:
    return randB();

  case ParameterId::moOscPitch_lfoInvert:
  case ParameterId::moOscColor_lfoInvert:
  case ParameterId::moFilterCutoff_lfoInvert:
  case ParameterId::moShaperLevel_lfoInvert:
  case ParameterId::moPhaserLevel_lfoInvert:
  case ParameterId::moDelayTime_lfoInvert:
    return randB(0.3f);

  case ParameterId::moOscPitch_egStride:
  case ParameterId::moOscColor_egStride:
  case ParameterId::moFilterCutoff_egStride:
  case ParameterId::moShaperLevel_egStride:
  case ParameterId::moPhaserLevel_egStride:
  case ParameterId::moDelayTime_egStride:
    return randChoice(Divisions::moEgStride);

  case ParameterId::moOscPitch_egWave:
  case ParameterId::moOscColor_egWave:
  case ParameterId::moFilterCutoff_egWave:
  case ParameterId::moShaperLevel_egWave:
  case ParameterId::moPhaserLevel_egWave:
  case ParameterId::moDelayTime_egWave:
    return randChoice(Divisions::moEgWave);

  case ParameterId::moOscPitch_egCurve:
  case ParameterId::moOscColor_egCurve:
  case ParameterId::moFilterCutoff_egCurve:
  case ParameterId::moShaperLevel_egCurve:
  case ParameterId::moPhaserLevel_egCurve:
  case ParameterId::moDelayTime_egCurve:
    return randF();

  case ParameterId::moOscPitch_egInvert:
  case ParameterId::moOscColor_egInvert:
  case ParameterId::moFilterCutoff_egInvert:
  case ParameterId::moShaperLevel_egInvert:
  case ParameterId::moPhaserLevel_egInvert:
  case ParameterId::moDelayTime_egInvert:
    return randB(0.3f);
  default:
    break;
  }

  // Individual parameter cases
  switch (paramId) {
  case ParameterId::oscOn:
    return 1.0f; // fixed to on
  case ParameterId::oscWave:
    return randChoice(Divisions::oscWave);
  case ParameterId::oscPitch:
    return randF();
  case ParameterId::oscPitchMode:
    return randChoice(Divisions::oscPitchMode);
  case ParameterId::oscPitchMoSmooth:
    return randB();
  case ParameterId::oscOctave:
    return randIntRange(-1, 1);
  case ParameterId::oscColor:
    return randF();
  case ParameterId::oscColorMode:
    return randChoice(Divisions::oscColorMode);
  case ParameterId::oscUnisonMode:
    return randChoiceWeightedI(Divisions::oscUnisonMode, detuneModeWeights);
  case ParameterId::oscUnisonDetune:
    return randFR(0.0f, 0.7f);

  case ParameterId::filterOn:
    return randB(0.8f);
  case ParameterId::filterCutoff:
    return randFR(0.3f, 1.0f);
  case ParameterId::filterPeak:
    return randF();

  case ParameterId::ampOn:
    return randB(0.9f);
  case ParameterId::ampEgHold:
    return randFR(0.0f, 0.9f);
  case ParameterId::ampEgDecay:
    return randFR(0.0f, 0.8f);

  case ParameterId::shaperOn:
    return randB(0.4f);
  case ParameterId::shaperMode:
    return randChoice(Divisions::shaperMode);
  case ParameterId::shaperLevel:
    return randF();

  case ParameterId::phaserOn:
    return randB(0.4f);
  case ParameterId::phaserLevel:
    return randF();

  case ParameterId::delayOn:
    return randB(0.4f);
  case ParameterId::delayTime:
    return randF();
  case ParameterId::delayFeed:
    return randF();

  case ParameterId::stepDelayOn:
    return randB(0.35f);
  case ParameterId::stepDelayStep:
    return randChoice(Divisions::stepDelayStep);
  case ParameterId::stepDelayFeed:
    return randF();
  case ParameterId::stepDelayMix:
    return randFR(0.2f, 0.8f);

  case ParameterId::gaterStride:
    return 0.0f; // fixed to /16
  case ParameterId::gaterType:
    return randChoice(Divisions::gaterType);
  case ParameterId::gaterRndTieOn:
    return randB(0.75f);
  case ParameterId::gaterRndTieCover:
    return randF();
  case ParameterId::exGaterSeqStride:
    return randChoice(Divisions::gaterExSourceStride);
  case ParameterId::gaterSeqPatterns_0:
    return randChoice(Divisions::gateSequencerCodeForHead);
  case ParameterId::gaterSeqPatterns_1:
    return randChoice(Divisions::gateSequencerCode);
  case ParameterId::gaterSeqPatterns_2:
    return randChoice(Divisions::gateSequencerCode);
  case ParameterId::gaterSeqPatterns_3:
    return randChoice(Divisions::gateSequencerCode);
  case ParameterId::exGaterCodes_0:
    return randChoice(Divisions::exGaterCodeForHead);
  case ParameterId::exGaterCodes_1:
    return randChoice(Divisions::exGaterCode);
  case ParameterId::exGaterCodes_2:
    return randChoice(Divisions::exGaterCode);
  case ParameterId::exGaterCodes_3:
    return randChoice(Divisions::exGaterCode);

  case ParameterId::kickPresetKey:
    return randChoice(Divisions::kickPresetKey);
  case ParameterId::bassPresetKey:
    return randChoice(Divisions::bassPresetKey);
  case ParameterId::bassTailAccentPatternKey:
    return randChoice(Divisions::bassTailAccentPatternKey);
  default:
    break;
  }

  return -1.0f;
}

inline void
randomizeParameters(std::unordered_map<ParameterId, float> &parameters,
                    int randomCount) {
  const int numParameters = static_cast<int>(parameters.size());
  if (randomCount == -1) {
    randomCount = numParameters;
  }

  const auto effectiveFlags = buildEffectiveFlags(parameters);
  const auto parameterIds = buildParameterIdsRandomOrder(parameters);

  int changedCount = 0;
  for (int i = 0; i < numParameters; i++) {
    const ParameterId id = parameterIds[i];
    auto efIt = effectiveFlags.find(id);
    if (efIt == effectiveFlags.end() || !efIt->second)
      continue;

    const float currentValue = parameters[id];
    const float newValue = getRandomParameterValue(id);
    if (newValue < 0.0f)
      continue;
    if (m_abs(newValue - currentValue) < 1e-6f)
      continue;

    parameters[id] = newValue;
    changedCount++;
    if (changedCount >= randomCount)
      break;
  }

  // Ensure amp EG has reasonable values
  if (parameters[ParameterId::ampEgHold] < 0.2f &&
      parameters[ParameterId::ampEgDecay] < 0.2f) {
    parameters[ParameterId::ampEgHold] = randFR(0.2f, 0.9f);
    parameters[ParameterId::ampEgDecay] = randFR(0.2f, 0.9f);
  }
}

inline int getParameterRandomCount(RandomizeLevel randomizeLevel) {
  switch (randomizeLevel) {
  case RandomizeLevel::rnd1:
    return 1;
  case RandomizeLevel::rnd2:
    return 2;
  case RandomizeLevel::rnd5:
    return 5;
  case RandomizeLevel::rnd10:
    return 10;
  case RandomizeLevel::rnd20:
    return 20;
  case RandomizeLevel::rndFull:
    return -1;
  }
  return -1;
}

} // anonymous namespace

inline void applyRandomizeParameters(std::map<uint64_t, float> &parameters) {
  auto it = parameters.find(ParameterId::randomizeLevel);
  const RandomizeLevel randomizeLevel =
      (it != parameters.end())
          ? static_cast<RandomizeLevel>(static_cast<int>(it->second))
          : RandomizeLevel::rndFull;
  const int randomCount = getParameterRandomCount(randomizeLevel);

  std::unordered_map<ParameterId, float> params;
  for (auto &[k, v] : parameters) {
    params[static_cast<ParameterId>(k)] = v;
  }
  randomizeParameters(params, randomCount);
  for (auto &[k, v] : params) {
    parameters[static_cast<uint64_t>(k)] = v;
  }
}

} // namespace dsp
