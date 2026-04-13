#pragma once
#include "../../utils/konsole.h"

namespace dsp {

class Interpolator {
private:
  float value;
  float delta;
  bool hasValue;

public:
  Interpolator() : value(0.0f), delta(0.0f), hasValue(false) {}

  void feed(float nextValue, int n) {
    if (!hasValue) {
      value = nextValue;
      hasValue = true;
    }
    delta = (nextValue - value) / static_cast<float>(n);
  }

  float advance() {
    if (!hasValue) {
      debugEmitError("interpolator.advance: value is undefined");
      return 0.0f;
    }
    float res = value;
    value += delta;
    return res;
  }

  void reset() {
    hasValue = false;
    value = 0.0f;
    delta = 0.0f;
  }
};

} // namespace dsp
