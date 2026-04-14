#pragma once
#include <stdexcept>

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
      throw std::runtime_error("interpolator.advance: value is undefined");
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
