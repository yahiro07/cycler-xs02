#pragma once
#include "../base/parameter-defs.h"
#include "../base/synthesis-bus.h"
#include "impl/motion-types.h"
#include "impl/motion-wrapper.h"
#include "funcs/motion-mux.h"
#include "funcs/pitch-mapping.h"
#include "../utils/number-utils.h"

namespace dsp {

// pitch, smooth mapping on, 相対ノート値で出力
// SD/SGの出力ではrandom mappingした結果の相対ノート値の間で線形補間
// rndのfallbackでノブの値によらずノブ中央(0.5, ノート基準音)の値を返す
inline float randomValueMapperFn_oscPitchRelNote(SynthesisBus &bus, float rr,
                                                 RandomValueStateFlag stateFlag) {
  const auto &sp = bus.parameters;
  float prPitch;
  if (stateFlag == RandomValueStateFlag::rndSkip) {
    prPitch = 0.5f;
  } else if (stateFlag == RandomValueStateFlag::rndOff) {
    prPitch = sp.oscPitch;
  } else {
    prPitch = clampValueZeroOne(
        sp.oscPitch + mapUnaryBipolar(rr) * sp.moOscPitch.moAmount * 0.5f);
  }
  return mapParamOscPitchToRelativeNote(prPitch, sp.oscPitchMode);
}

inline float randomValueMapperFn_oscPrPitch(SynthesisBus &bus, float rr,
                                            RandomValueStateFlag stateFlag) {
  const auto &sp = bus.parameters;
  float prPitch;
  if (stateFlag == RandomValueStateFlag::rndSkip) {
    prPitch = 0.5f;
  } else if (stateFlag == RandomValueStateFlag::rndOff) {
    prPitch = sp.oscPitch;
  } else {
    prPitch = clampValueZeroOne(
        sp.oscPitch + mapUnaryBipolar(rr) * sp.moOscPitch.moAmount * 0.5f);
  }
  return prPitch;
}

inline float mapMotionPartValuesToTargetParameter(
  const MotionPartValues& partValues,
  float knobValue,
  const MotionParams& mp
) {
  if (!mp.moOn) return knobValue;
  
  float envMod = partValues.envMod * partValues.egOnGain;
  float lfoDepth = partValues.lfoDepth * partValues.lfoOnGain;
  float rndRange = partValues.rndRange * partValues.rndOnGain;
  
  return mixMotionPartValues(
    partValues.egLevel,
    envMod,
    partValues.lfoOut,
    lfoDepth,
    partValues.rndOut,
    rndRange,
    knobValue,
    1.0f  // muxScaling
  );
}

inline float getOscPitchRelNote(SynthesisBus& bus, float stepPos) {
  const auto& sp = bus.parameters;
  const MotionPartValues partValues = processMotionWrapper(
      bus, MoId::oscPitch, stepPos, randomValueMapperFn_oscPitchRelNote);
  
  if (!sp.moOscPitch.moOn) {
    return mapParamOscPitchToRelativeNote(sp.oscPitch, sp.oscPitchMode);
  }
  
  // Relative note output for OSC pitch
  // LFO/EG adds relative note values as modulation within a one-octave range
  const float egm = partValues.egOnGain * mapUnaryBipolar(partValues.envMod) * 
                    power2(partValues.egLevel) * 12.0f;
  const float lfm = partValues.lfoOnGain * mapUnaryBipolar(partValues.lfoOut) * 
                    power2(partValues.lfoDepth) * 12.0f;
  return partValues.rndMappedValue + egm + lfm;
}

inline float getOscPrPitch(SynthesisBus& bus, float stepPos) {
  const auto& sp = bus.parameters;
  const MotionPartValues partValues = processMotionWrapper(
      bus, MoId::oscPitch, stepPos, randomValueMapperFn_oscPrPitch);
  const auto& mp = sp.moOscPitch;
  
  // When using rnd, return the value mapped by rnd using the knob center fallback
  if (mp.moOn && mp.moType == MoType::rnd) {
    return partValues.rndMappedValue;
  }
  
  // lfo/eg is handled in the same way as other knob automations
  return mapMotionPartValuesToTargetParameter(partValues, sp.oscPitch, mp);
}

inline float getOscColorValue(SynthesisBus& bus, float stepPos) {
  const auto& sp = bus.parameters;
  const MotionPartValues partValues = processMotionWrapper(bus, MoId::oscColor, stepPos);
  return mapMotionPartValuesToTargetParameter(partValues, sp.oscColor, sp.moOscColor);
}

inline float getFilterPrCutoff(SynthesisBus& bus, float stepPos) {
  const auto& sp = bus.parameters;
  const MotionPartValues partValues = processMotionWrapper(bus, MoId::filterCutoff, stepPos);
  return mapMotionPartValuesToTargetParameter(partValues, sp.filterCutoff, sp.moFilterCutoff);
}

inline float getShaperLevelValue(SynthesisBus& bus, float stepPos) {
  const auto& sp = bus.parameters;
  const MotionPartValues partValues = processMotionWrapper(bus, MoId::shaperLevel, stepPos);
  return mapMotionPartValuesToTargetParameter(partValues, sp.shaperLevel, sp.moShaperLevel);
}

inline float getPhaserLevelValue(SynthesisBus& bus, float stepPos) {
  const auto& sp = bus.parameters;
  const MotionPartValues partValues = processMotionWrapper(bus, MoId::phaserLevel, stepPos);
  return mapMotionPartValuesToTargetParameter(partValues, sp.phaserLevel, sp.moPhaserLevel);
}

inline float getDelayTimeValue(SynthesisBus& bus, float stepPos) {
  const auto& sp = bus.parameters;
  const MotionPartValues partValues = processMotionWrapper(bus, MoId::delayTime, stepPos);
  return mapMotionPartValuesToTargetParameter(partValues, sp.delayTime, sp.moDelayTime);
}

inline void moMappers_updateMoValues(SynthesisBus &bus) {
  auto &interm = bus.interm;
  const float step = bus.currentStep;
  interm.pmxOscRelNote = getOscPitchRelNote(bus, step);
  interm.pmxOscPrPitch = getOscPrPitch(bus, step);
  interm.pmxOscColor = getOscColorValue(bus, step);
  interm.pmxFilterPrCutoff = getFilterPrCutoff(bus, step);
  interm.pmxShaperLevel = getShaperLevelValue(bus, step);
  interm.pmxPhaserLevel = getPhaserLevelValue(bus, step);
  interm.pmxDelayTime = getDelayTimeValue(bus, step);
}

} // namespace dsp
