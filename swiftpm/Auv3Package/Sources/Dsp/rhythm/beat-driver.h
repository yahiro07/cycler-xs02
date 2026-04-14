#pragma once
#include "../base/parameter-defs.h"
#include "../base/synthesis-bus.h"
#include "../dsp-modules/basic/sequence-helper.h"
#include "bass-synthesizer.h"
#include "kick-synthesizer.h"
#include <array>

namespace dsp {

static const auto bassTailAccentPatterns = []() {
  std::array<const char *, 5> patterns;
  patterns[static_cast<int>(BassTailAccentPatternKey::off)] =
      "_aaa_aaa_aaa_aaa";
  patterns[static_cast<int>(BassTailAccentPatternKey::pattern1)] =
      "_aaa_aaa_aaa_apa";
  patterns[static_cast<int>(BassTailAccentPatternKey::pattern2)] =
      "_aaa_aaa_aaa_aap";
  patterns[static_cast<int>(BassTailAccentPatternKey::pattern3)] =
      "_aaa_aaa_aaa_aag";
  patterns[static_cast<int>(BassTailAccentPatternKey::pattern4)] =
      "_aaa_aaa_aaa_apg";
  return patterns;
}();

class BeatDriver {
private:
  SynthesisBus &bus;
  KickSynth &kickSynth;
  BassSynth &bassSynth;
  bool kickPlaying = false;

  void onStep(int stepIndex) {
    const auto &sp = bus.parameters;

    // Kick handling
    {
      const int pos = stepIndex % 4;
      if (pos == 0 && sp.clockingOn && bus.gateOn && sp.kickOn) {
        kickSynth.playTone();
        kickPlaying = true;
      } else if (pos == 2 && kickPlaying) {
        kickSynth.stopTone();
        kickPlaying = false;
      }
    }

    // Bass handling
    if (sp.clockingOn && bus.gateOn && sp.bassOn) {
      int pos = stepIndex % 32;
      const char *targetPattern =
          bassTailAccentPatterns[static_cast<int>(sp.bassTailAccentPatternKey)];
      const char *pattern = nullptr;

      if (bus.loopBars == static_cast<int>(LoopBarsKey::bar1)) {
        // Loop through the target one bar at a time
        pattern = targetPattern;
        pos %= 16;
      } else {
        // First bar is default pattern, second bar is target pattern
        pattern = (pos < 16) ? bassTailAccentPatterns[static_cast<int>(
                                   BassTailAccentPatternKey::off)]
                             : targetPattern;
        pos %= 16;
      }

      const char code = pattern[pos];
      if (code != '_') {
        int rel = 0;
        switch (code) {
        case 'a':
          rel = 0;
          break;
        case 'p':
          rel = 1;
          break;
        case 'g':
          rel = -2;
          break;
        case 'c':
          rel = 3;
          break;
        default:
          rel = 0;
          break;
        }

        const float unitStepSec = calcStepTimeSec(1.0f, bus.bpm);
        const float ni = bus.noteNumber - 12.0f + static_cast<float>(rel);
        bassSynth.playTone(ni, unitStepSec * sp.bassDuty);
      }
    }
  }

public:
  BeatDriver(SynthesisBus &bus_, KickSynth &kickSynth_, BassSynth &bassSynth_)
      : bus(bus_), kickSynth(kickSynth_), bassSynth(bassSynth_) {}

  void start() { onStep(0); }

  void advance() {
    const auto &sp = bus.parameters;
    const float currentStep = bus.currentStep;
    const float frameStepLength =
        calcNumStepsForSamples(bus.bpm, bus.sampleRate, bus.blockLength);
    const float nextStep = fmodf(currentStep + frameStepLength,
                                 static_cast<float>(bus.loopBars * 16));
    const int s0 = static_cast<int>(currentStep);
    const int s1 = static_cast<int>(nextStep);

    if (s1 != s0) {
      onStep(s1);
    }
  }
};

} // namespace dsp
