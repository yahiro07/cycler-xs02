#pragma once
#include "../../base/parameter-defs.h"
#include "../../base/synthesis-bus.h"
#include "../../dsp-modules/basic/curves.h"
#include "../../dsp-modules/basic/deterministic-random.h"
#include "../../utils/number-utils.h"
#include "../funcs/eg-curves.h"
#include "../funcs/lfo-waves.h"
#include "../funcs/steps-common.h"
#include "../gaters/ramp-provider.h"
#include "../gaters/ramp-types.h"
#include "motion-types.h"

namespace dsp {

constexpr int moPartSeed_rnd = 1;
constexpr int moPartSeed_lfo = 2;
constexpr int moPartSeed_eg = 3;
constexpr int moPartSeed_rndCover = 4;

inline RampSpec wrapGetStepRamp(SynthesisBus &bus, GateStride stride,
                                float stepPos) {
  return getPlainRamp(bus, lowClipZero(stepPos), stride);
}

inline RampSpec wrapGetMoStepRamp(SynthesisBus &bus, MotionStride stride,
                                  float stepPos) {
  return getMotionRamp(bus, lowClipZero(stepPos), stride);
}

inline float rndCoverCurved(float cover) { return invPower2Weak(cover, 0.7f); }

inline float getRandomWithCover(SynthesisBus &bus, int moIdSeed,
                                float rampHeadPos, float rndCover) {
  const float rrA = deterministicRandom(bus.loopSeed + rampHeadPos + moIdSeed +
                                        moPartSeed_rndCover);
  if (rrA > rndCoverCurved(rndCover)) {
    return 0.5f;
  }
  return deterministicRandom(bus.loopSeed + rampHeadPos + moIdSeed +
                             moPartSeed_rnd);
}

inline float wrapGlide(float pos) { return glide3(pos, 0.5f); }

static inline float getMappedValueWithRandom(SynthesisBus &bus, int moIdSeed,
                                             float rampHeadPos, float rndCover,
                                             RandomValueMapperFn mapperFn) {
  const float rrA = deterministicRandom(bus.loopSeed + rampHeadPos + moIdSeed +
                                        moPartSeed_rndCover);
  if (rrA > rndCoverCurved(rndCover)) {
    return mapperFn(bus, 0.0f, RandomValueStateFlag::rndSkip);
  }
  const float rr = deterministicRandom(bus.loopSeed + rampHeadPos + moIdSeed +
                                       moPartSeed_rnd);
  return mapperFn(bus, rr, RandomValueStateFlag::rndActive);
}

inline float getMoRndMapped(SynthesisBus &bus, const MotionParams &mp,
                            int moIdSeed, float stepPos,
                            RandomValueMapperFn mapperFn) {
  if (mp.moType == MoType::rnd) {
    const RampSpec ramp = wrapGetMoStepRamp(bus, mp.rndStride, stepPos);
    const float semiCurrent = getMappedValueWithRandom(
        bus, moIdSeed, ramp.headPos, mp.rndCover, mapperFn);
    const bool isSdMode = mp.rndMode == MoRndMode::sd;
    const bool applyGlide = mp.rndMode == MoRndMode::sg;
    if (applyGlide || isSdMode) {
      const float semiNext = getMappedValueWithRandom(
          bus, moIdSeed, ramp.headPos + ramp.duration, mp.rndCover, mapperFn);
      const float m = applyGlide ? wrapGlide(ramp.progress) : ramp.progress;
      return mixValue(semiCurrent, semiNext, m);
    }
    return semiCurrent;
  }
  return mapperFn(bus, 0.0f, RandomValueStateFlag::rndOff);
}

inline float getMoRndMod(SynthesisBus &bus, const MotionParams &mp, int moIdSeed,
                         float stepPos) {
  if (mp.moType == MoType::rnd) {
    const RampSpec ramp = wrapGetMoStepRamp(bus, mp.rndStride, stepPos);
    const float rrCurrent =
        getRandomWithCover(bus, moIdSeed, ramp.headPos, mp.rndCover);
    const bool isSdMode = mp.rndMode == MoRndMode::sd;
    const bool applyGlide = mp.rndMode == MoRndMode::sg;

    if (applyGlide || isSdMode) {
      const float rrNext = getRandomWithCover(
          bus, moIdSeed, ramp.headPos + ramp.duration, mp.rndCover);
      const float m = applyGlide ? wrapGlide(ramp.progress) : ramp.progress;
      return mixValue(rrCurrent, rrNext, m);
    }
    return rrCurrent;
  }
  return 0.0f;
}

inline float getMoLfoOut(const MotionParams &mp, float stepPos) {
  if (mp.moType == MoType::lfo) {
    const float sd = getLfoStepPeriod(mp.lfoRate, mp.lfoRateStepped);
    const RampSpec ramp = getMasterDividedRamp(stepPos, sd, false);
    const float phase = ramp.progress;
    return getLfoWave(mp.lfoWave, phase);
  }
  return 0.0f;
}

inline float getMoEgLevel(SynthesisBus &bus, const MotionParams &mp,
                          float stepPos) {
  const RampSpec ramp = wrapGetMoStepRamp(bus, mp.egStride, stepPos);
  // Using progress mode (not pulsed mode)
  return getEgCurve(mp.egWave, ramp.progress, mp.egCurve);
}

inline float getAmpEgLevel(SynthesisBus &bus, float stepPos) {
  const RampSpec ramp = wrapGetStepRamp(bus, GateStride::gate, stepPos);
  return getAmpEgCurvePL(ramp.relPos, bus.parameters.ampEgHold,
                         bus.parameters.ampEgDecay, ramp.duration);
}

} // namespace dsp
