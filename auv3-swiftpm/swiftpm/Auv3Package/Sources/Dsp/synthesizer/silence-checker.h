#pragma once
#include "../base/synthesis-bus.h"
#include "../dsp-modules/basic/buffer-functions.h"

namespace dsp {

class SilenceChecker {
private:
  SynthesisBus &bus;
  bool soundActive = false;
  float silentSec = 0.f;

public:
  SilenceChecker(SynthesisBus &bus) : bus(bus) {}

  bool isSoundActive() const { return soundActive; }

  void wakeUp() {
    soundActive = true;
    silentSec = 0.f;
  }

  void update(const float *buffer, int len) {
    if (soundActive) {
      const float maxLevel = getBufferMaxLevel(buffer, len);
      if (maxLevel < 1e-3f) {
        silentSec += static_cast<float>(len) / bus.sampleRate;
        if (silentSec > 3.f) {
          soundActive = false;
        }
      }
    }
  }
};

} // namespace dsp
