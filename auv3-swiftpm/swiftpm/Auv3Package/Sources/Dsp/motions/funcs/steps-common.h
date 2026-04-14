#pragma once
#include "../../base/parameter-defs.h"
#include "../../utils/math-utils.h"
#include "../../utils/number-utils.h"

namespace dsp {

inline float getLfoStepPeriod(float lfoRate, bool lfoRateStepped) {
  float k = 0.0f;
  if (lfoRateStepped) {
    k = static_cast<float>(mapUnaryToInt(1.0f - lfoRate, 0, 6));
  } else {
    k = (1.0f - lfoRate) * 6.0f;
  }
  return m_pow(2.0f, k);
}

inline int getStepPeriod(PureStride stride) {
  switch (stride) {
    case PureStride::div16: return 1;
    case PureStride::div8: return 2;
    case PureStride::div4: return 4;
    case PureStride::div2: return 8;
    case PureStride::mul1: return 16;
    case PureStride::mul2: return 32;
    case PureStride::mul4: return 64;
  }
  return 16;
}

inline int getStepPeriodForDelay(DelayStep step) {
  switch (step) {
    case DelayStep::div16: return 1;
    case DelayStep::div8: return 2;
    case DelayStep::div4: return 4;
  }
  return 4;
}

inline int getStepPeriodForExGater(GaterExSourceStride stride) {
  switch (stride) {
    case GaterExSourceStride::div16: return 1;
    case GaterExSourceStride::div8: return 2;
    case GaterExSourceStride::div4: return 4;
    case GaterExSourceStride::div2: return 8;
    case GaterExSourceStride::mul1: return 16;
  }
  return 16;
}

inline int getStepPeriodForGaterMain(GaterSourceStride stride) {
  switch (stride) {
    case GaterSourceStride::div16: return 1;
    case GaterSourceStride::div8: return 2;
    case GaterSourceStride::div4: return 4;
  }
  return 4;
}

inline int getLoopBarsFromKey(LoopBarsKey bars) {
  switch (bars) {
    case LoopBarsKey::bar1: return 1;
    case LoopBarsKey::bar2: return 2;
    case LoopBarsKey::bar4: return 4;
  }
  return 1;
}

} // namespace dsp
