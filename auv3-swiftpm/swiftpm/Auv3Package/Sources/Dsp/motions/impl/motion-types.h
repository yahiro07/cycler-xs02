#pragma once
#include "../../base/synthesis-bus.h"

namespace dsp {

enum class RandomValueStateFlag {
  rndActive = 1,
  rndSkip = 2,
  rndOff = 3,
};

// Function pointer type for custom random value mappers.
// rr is a value in [0,1] (only meaningful when stateFlag == rndActive).
typedef float (*RandomValueMapperFn)(SynthesisBus &, float rr,
                                     RandomValueStateFlag stateFlag);

struct MotionPartValues {
  float rndOut = 0.0f; // 0~1
  float rndMappedValue = 0.0f;
  float egLevel = 0.0f;  // 0~1
  float lfoOut = 0.0f;   // 0~1
  float lfoDepth = 0.0f; // 0~1
  float envMod = 0.0f;   // 0~1
  float rndRange = 0.0f; // 0~1
  float lfoOnGain = 0.0f;
  float rndOnGain = 0.0f;
  float egOnGain = 0.0f;
};

} // namespace dsp
