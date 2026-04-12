#pragma once
#include "../../base/parameter-defs.h"
#include "../../base/synthesis-bus.h"
#include "../../utils/number-utils.h"
#include "motion-curve-mapper.h"
#include "motion-types.h"

namespace dsp {

constexpr int moIdSeeds[6] = {
    110, // oscPitch
    120, // oscColor
    130, // filterCutoff
    140, // shaperLevel
    150, // delayTime
    160  // phaserLevel
};

inline int getMoIdSeed(MoId moId) { return moIdSeeds[static_cast<int>(moId)]; }

inline MotionParams getMotionParams(const SynthesisBus &bus, MoId moId) {
  switch (moId) {
  case MoId::oscPitch:
    return bus.parameters.moOscPitch;
  case MoId::oscColor:
    return bus.parameters.moOscColor;
  case MoId::filterCutoff:
    return bus.parameters.moFilterCutoff;
  case MoId::shaperLevel:
    return bus.parameters.moShaperLevel;
  case MoId::delayTime:
    return bus.parameters.moDelayTime;
  case MoId::phaserLevel:
    return bus.parameters.moPhaserLevel;
  }
  return bus.parameters.moOscPitch; // fallback
}

inline MotionPartValues
processMotionWrapper(SynthesisBus &bus, MoId moId, float stepPos,
                     RandomValueMapperFn randomValueMapperFn = nullptr) {
  const MotionParams mp = getMotionParams(bus, moId);
  const int moIdSeed = getMoIdSeed(moId);

  const float rndOut = getMoRndMod(bus, mp, moIdSeed, stepPos);
  const float rndMappedValue =
      randomValueMapperFn
          ? getMoRndMapped(bus, mp, moIdSeed, stepPos, randomValueMapperFn)
          : 0.0f;
  float egLevel = getMoEgLevel(bus, mp, stepPos);
  float lfoOut = getMoLfoOut(mp, stepPos);

  if (mp.egInvert) {
    egLevel = 1.0f - egLevel;
  }
  if (mp.lfoInvert) {
    lfoOut = 1.0f - lfoOut;
  }

  const float moAmount = mp.moAmount;
  const bool isRand = mp.moType == MoType::rnd;
  const bool isLfo = mp.moType == MoType::lfo;
  const bool isEg = mp.moType == MoType::eg;

  return MotionPartValues{
      rndOut,
      rndMappedValue,
      egLevel,
      lfoOut,
      moAmount,             // lfoDepth
      moAmount,             // envMod
      moAmount,             // rndRange
      isLfo ? 1.0f : 0.0f,  // lfoOnGain
      isRand ? 1.0f : 0.0f, // rndOnGain
      isEg ? 1.0f : 0.0f    // egOnGain
  };
}

} // namespace dsp
