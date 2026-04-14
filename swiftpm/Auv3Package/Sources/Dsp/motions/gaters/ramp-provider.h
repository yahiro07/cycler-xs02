#pragma once
#include "../../base/parameter-defs.h"
#include "../../base/synthesis-bus.h"
#include "../../utils/math-utils.h"
#include "../../utils/number-utils.h"
#include "../funcs/steps-common.h"
#include "./ramp-types.h"
#include "gater-ex-seq.h"
#include "gater-main-lax.h"
#include "gater-main-seq.h"

namespace dsp {

inline RampSpec getGaterStepRamp(float stepPos, PureStride gaterPeriod,
                                 StepRampCode rampCode) {
  const int stepPeriod = getStepPeriod(gaterPeriod);
  const float scaledStep = stepPos / stepPeriod;
  float headPos = m_floor(scaledStep) * stepPeriod;
  float progress = fracPart(scaledStep);
  float duration = static_cast<float>(stepPeriod);

  if (rampCode == StepRampCode::tie1) {
    progress *= 0.5f;
    duration *= 2.0f;
  } else if (rampCode == StepRampCode::tie2) {
    headPos -= stepPeriod;
    progress = 0.5f + progress * 0.5f;
    duration *= 2.0f;
  }

  return RampSpec{headPos, progress * duration, progress, duration};
}

inline RampSpec getMasterDividedRamp(float stepPos, float stepPeriod,
                                     bool oneShot = false) {
  const float scaledStep = stepPos / stepPeriod;
  if (oneShot) {
    const float progress = stepPos < stepPeriod ? fracPart(scaledStep) : 1.0f;
    return RampSpec{0.0f, stepPos, progress, stepPeriod};
  } else {
    const float progress = fracPart(scaledStep);
    return RampSpec{m_floor(scaledStep) * stepPeriod, progress * stepPeriod,
                    progress, stepPeriod};
  }
}

inline RampSpec getPlainRamp(SynthesisBus &bus, float stepPos,
                             GateStride inputStride) {
  const auto &sp = bus.parameters;
  if (inputStride == GateStride::gate) {
    const StepRampCode rampCode =
        (sp.gaterType == GaterType::lax)
            ? gaterMainLaxMode_getRampCodeCached(bus, stepPos)
            : gaterMainSeqMode_getRampCode(bus, stepPos);

    const PureStride gaterStride = static_cast<PureStride>(sp.gaterStride);
    return getGaterStepRamp(stepPos, gaterStride, rampCode);
  } else {
    const PureStride stride = static_cast<PureStride>(inputStride);
    const float stepPeriod = static_cast<float>(getStepPeriod(stride));
    return getMasterDividedRamp(stepPos, stepPeriod, false);
  }
}

inline RampSpec getMotionRamp(SynthesisBus &bus, float stepPos,
                              MotionStride inputStride) {
  if (inputStride == MotionStride::ex) {
    return gaterExSeqMode_getRampSpec(bus, stepPos);
  }
  const GateStride stride = static_cast<GateStride>(inputStride);
  return getPlainRamp(bus, stepPos, stride);
}

} // namespace dsp
