#pragma once
#include "../../base/konsole.h"
#include "../../base/synthesis-bus.h"
#include "../../utils/math-utils.h"
#include "../funcs/steps-common.h"
#include "ramp-types.h"
#include <cstring>

namespace dsp {

struct GaterMainLaxState {
  StepRampCode stepRampCodes[64];
  struct {
    bool gaterRndTieOn = false;
    float gaterRndTieCover = 0.0f;
    float loopSeed = 0.0f;
    bool initialized = false;
  } stepCellsKeys;

  GaterMainLaxState() {
    for (int i = 0; i < 64; i++) {
      stepRampCodes[i] = StepRampCode::one;
    }
  }
};

inline void placeRandomTwoCellCodes(StepRampCode *stepRampCodes, int stepLength,
                                    float cover) {
  const int maxNum = static_cast<int>((stepLength * cover) / 2.0f);
  const int trialRate = 2;
  int num = 0;

  for (int i = 0; i < maxNum * trialRate; i++) {
    const int idx = static_cast<int>(m_random() * (stepLength - 1));
    if (!(stepRampCodes[idx] == StepRampCode::one &&
          stepRampCodes[idx + 1] == StepRampCode::one)) {
      continue;
    }
    stepRampCodes[idx] = StepRampCode::tie1;
    stepRampCodes[idx + 1] = StepRampCode::tie2;
    num++;
    if (num >= maxNum) {
      break;
    }
  }
}

inline void updateStepCellCodes(SynthesisBus &bus, GaterMainLaxState &gs) {
  const auto &sp = bus.parameters;
  for (int i = 0; i < 64; i++) {
    gs.stepRampCodes[i] = StepRampCode::one;
  }
  const int stepLength = bus.loopBars * 16;
  if (sp.gaterRndTieOn) {
    placeRandomTwoCellCodes(gs.stepRampCodes, stepLength, sp.gaterRndTieCover);
  }
}

inline void gaterMainLaxMode_setupLocalState(SynthesisBus &bus) {
  if (!bus.moduleLocals.gaterMainLax) {
    bus.moduleLocals.gaterMainLax = new GaterMainLaxState();
  }
}
inline void gaterMainLaxMode_cleanupLocalState(SynthesisBus &bus) {
  if (bus.moduleLocals.gaterMainLax) {
    delete static_cast<GaterMainLaxState *>(bus.moduleLocals.gaterMainLax);
    bus.moduleLocals.gaterMainLax = nullptr;
  }
}

inline StepRampCode gaterMainLaxMode_getRampCodeCached(SynthesisBus &bus,
                                                       float stepPos) {
  auto *gaterState =
      static_cast<GaterMainLaxState *>(bus.moduleLocals.gaterMainLax);
  const auto &gp = bus.parameters;
  const int period = getStepPeriodForGaterMain(gp.gaterStride);
  const float scaledStep = stepPos / period;

  if (scaledStep >= 64) {
    debugEmitError("stepPos >= 64");
    return StepRampCode::one;
  }

  const int index = static_cast<int>(scaledStep);

  auto &gsk = gaterState->stepCellsKeys;
  if (!gsk.initialized || gp.gaterRndTieOn != gsk.gaterRndTieOn ||
      gp.gaterRndTieCover != gsk.gaterRndTieCover ||
      bus.loopSeed != gsk.loopSeed) {
    updateStepCellCodes(bus, *gaterState);
    gsk.gaterRndTieOn = gp.gaterRndTieOn;
    gsk.gaterRndTieCover = gp.gaterRndTieCover;
    gsk.loopSeed = bus.loopSeed;
    gsk.initialized = true;
  }

  return gaterState->stepRampCodes[index];
}

} // namespace dsp
