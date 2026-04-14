#pragma once
#include "../../utils/math-utils.h"
#include "../../utils/number-utils.h"

namespace dsp {

inline float mixMotionPartValues(float egLevel, float envMod, float lfoOut, 
                                 float lfoDepth, float rndOut, float rndRange,
                                 float knobValue, float muxScaling) {
  egLevel = mapUnaryBipolar(egLevel);
  lfoOut = mapUnaryBipolar(lfoOut);
  rndOut = mapUnaryBipolar(rndOut);
  
  const float egm = egLevel * envMod;
  const float rdm = rndOut * rndRange;
  const float lfm = lfoOut * lfoDepth;
  const float amtTotal = envMod + lfoDepth + rndRange;
  const float muxed = (rdm + lfm + egm) / (amtTotal == 0.0f ? 1.0f : amtTotal);
  const float g = amtTotal > 1.0f ? 1.0f : amtTotal;
  
  const float halfRange = 0.5f * muxScaling * g;
  const float hi = highClipOne(knobValue + halfRange);
  const float lo = lowClipZero(knobValue - halfRange);
  return linearInterpolate(muxed, -1.0f, 1.0f, lo, hi, true);
}

} // namespace dsp
