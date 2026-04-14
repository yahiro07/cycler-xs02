#pragma once
#include "parameter-defs.h"
#include <atomic>

namespace dsp {

struct SynthesisIntermediateState {
  float pmxOscRelNote;
  float pmxOscPrPitch;
  float pmxOscColor;
  float pmxFilterPrCutoff;
  float pmxShaperLevel;
  float pmxDelayTime;
  float pmxPhaserLevel;
  float ampGain;
};

struct ModuleLocalStates {
  void *gaterExSeq;   // using void* for now, will be typed later
  void *gaterMainLax; // using void* for now, will be typed later
};

struct SynthesisBus {
  SynthParametersSuit parameters = createSynthParametersSuit();
  SynthesisIntermediateState interm = {0.0f, 0.0f, 0.0f, 0.0f,
                                       0.0f, 0.0f, 0.0f, 0.0f};
  ModuleLocalStates moduleLocals = {nullptr, nullptr};
  float sampleRate = 0.0f;
  int maxFrames = 0;
  int noteNumber = 60;
  bool gateOn = false;
  bool gateTriggered = false;
  // Fractional, total steps since the start of playback, not reset at loop
  // boundaries
  float totalStep = 0.0f;
  // Fractional, reset at loop boundary, 0–64 (up to 4 bars)
  float currentStep = 0.0f;
  float loopSeed = 0;
  int blockLength = 0;
  bool gateStepAdvanced = false;
  float bpm = 130.0f;
  int loopBars = 2;
  bool beatActive = false;
  int paramVer = 0;
  std::atomic<bool> randomizationRequestFlag{false};
};

using Bus = SynthesisBus;

} // namespace dsp
