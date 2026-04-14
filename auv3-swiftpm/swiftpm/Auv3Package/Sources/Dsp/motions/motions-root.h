#pragma once
#include "../base/parameter-defs.h"
#include "../base/synthesis-bus.h"
#include "../dsp-modules/basic/sequence-helper.h"
#include "../utils/math-utils.h"
#include "impl/motion-curve-mapper.h"
#include "mo-mappers.h"

namespace dsp {

inline float getStepDeltaForFrame(const SynthesisBus &bus) {
  return calcNumStepsForSamples(bus.bpm, bus.sampleRate, bus.blockLength);
}

inline void updateGate(SynthesisBus &bus) {
  const float stepDelta = getStepDeltaForFrame(bus);
  const float prevStep = bus.currentStep - stepDelta;
  const RampSpec prevRamp = wrapGetStepRamp(bus, GateStride::gate, prevStep);
  const RampSpec currRamp =
      wrapGetStepRamp(bus, GateStride::gate, bus.currentStep);
  bus.gateStepAdvanced = (currRamp.headPos != prevRamp.headPos);
}

inline void updateAmp(SynthesisBus &bus) {
  bus.interm.ampGain = getAmpEgLevel(bus, bus.currentStep);
}

inline void motionsRoot_reset(SynthesisBus &bus) {
  bus.currentStep = 0.0f;
  bus.totalStep = 0.0f;
  bus.loopSeed = m_random();
}

inline void motionsRoot_advance(SynthesisBus &bus) {
  updateGate(bus);
  updateAmp(bus);
  moMappers_updateMoValues(bus);
}

inline void motionsRoot_processOnFrameEnd(SynthesisBus &bus) {
  const auto &sp = bus.parameters;
  const float stepDelta = getStepDeltaForFrame(bus);
  bus.totalStep += stepDelta;
  bus.currentStep += stepDelta;
  const float maxSteps = static_cast<float>(bus.loopBars * 16);

  if (bus.currentStep >= maxSteps) {
    bus.currentStep = fmodf(bus.currentStep, maxSteps);
    if (!sp.looped) {
      bus.loopSeed = m_random();
    }
    if (sp.autoRandomizeOnLoop) {
      bus.randomizationRequestFlag.store(true);
    }
  }
}

} // namespace dsp
