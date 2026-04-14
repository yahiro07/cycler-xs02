#pragma once
#include "../../base/synthesis-bus.h"
#include "./ramp-types.h"

namespace dsp {

struct RampSpecBase {
  float headPos;
  float progress;
  float duration;
  bool leaping = false;
};

inline RampSpec emitRampSpec(const RampSpecBase &base) {
  return RampSpec{base.headPos, base.progress * base.duration, base.progress,
                  base.duration};
}

} // namespace dsp
