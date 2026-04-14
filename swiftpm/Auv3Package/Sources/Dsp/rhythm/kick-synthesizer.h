#pragma once
#include "../base/parameter-defs.h"
#include "../dsp-modules/basic/buffer-functions.h"
#include "../dsp-modules/basic/curves.h"
#include "../dsp-modules/basic/interpolator.h"
#include "../dsp-modules/basic/synthesis-helper.h"
#include "../dsp-modules/effects/soft-clip-shaper.h"
#include "../dsp-modules/oscillators/pd-waves.h"
#include "../utils/number-utils.h"
#include <vector>

namespace dsp {

enum class KickEgWave { ds, d, pd };

struct KickParametersSuit {
  float oscPitch = 0.0f;
  float oscShape = 0.0f;
  KickEgWave pitchEgWave = KickEgWave::ds;
  float pitchEgTime = 0.0f;
  float pitchEgShape = 0.0f;
  float pitchEgAmount = 0.0f;
  KickEgWave ampEgWave = KickEgWave::ds;
  float ampEgTime = 0.0f;
  float ampEgShape = 0.0f;
  float ampDrive = 0.0f;
  float volume = 0.0f;
};

static const auto kickPresets = []() {
  std::array<KickParametersSuit, 5> presets;
  presets[static_cast<int>(KickPresetKey::kick1)] = {
    0.44f, 0.3f, KickEgWave::ds, 0.3f, 0.0f, 0.53f,
    KickEgWave::d, 0.63f, 0.6f, 0.05f, 0.66f
  };
  presets[static_cast<int>(KickPresetKey::kick2)] = {
    0.32f, 0.5f, KickEgWave::ds, 0.23f, 0.21f, 0.74f,
    KickEgWave::d, 0.52f, 0.38f, 0.28f, 1.0f
  };
  presets[static_cast<int>(KickPresetKey::kick3)] = {
    0.34f, 0.61f, KickEgWave::ds, 0.26f, 0.12f, 0.74f,
    KickEgWave::pd, 0.41f, 0.39f, 0.0f, 0.61f
  };
  presets[static_cast<int>(KickPresetKey::kick4)] = {
    0.32f, 0.32f, KickEgWave::ds, 0.29f, 0.23f, 0.68f,
    KickEgWave::pd, 0.55f, 0.51f, 0.0f, 0.46f
  };
  presets[static_cast<int>(KickPresetKey::kick5)] = {
    0.34f, 0.78f, KickEgWave::ds, 0.42f, 0.07f, 0.73f,
    KickEgWave::d, 0.6f, 0.38f, 0.21f, 0.24f
  };
  return presets;
}();

inline float getEgWaveCurve(KickEgWave wave, float x, float w) {
  if (wave == KickEgWave::ds) {
    const float base = w;
    return base + (1.0f - base) * mapExpCurve(1.0f - x);
  } else if (wave == KickEgWave::d) {
    const float scaler = mapUnaryTo(1.0f - w, 1.0f, 16.0f);
    return mapExpCurve(1.0f - x, scaler);
  } else if (wave == KickEgWave::pd) {
    if (x <= w) {
      return 1.0f;
    } else {
      const float u = linearInterpolate(x, w, 1.0f, 1.0f, 0.0f);
      return u * u;
    }
  }
  return 0.0f;
}

inline float calcOscDelta(float noteNumber, float prPitch, float sampleRate) {
  const float notesHalfRange = 24.0f;
  const float relNoteValue = mapUnaryTo(prPitch, -notesHalfRange, notesHalfRange);
  const float modNoteNumber = noteNumber + relNoteValue;
  const float frequency = midiToFrequency(modNoteNumber);
  return frequency / sampleRate;
}

struct KickStateBus {
  KickParametersSuit parameters{};
  float sampleRate = 0.0f;
  float ampEgValue = 0.0f;
  float pitchEgValue = 0.0f;
  float noteNumber = 60.0f;
  float currentTime = 0.0f;
  bool gateOn = false;
  float ampToleLevel = 0.0f;
  bool gateTriggered = false;
  std::vector<float> workBuffer{};
  struct {
    Interpolator miPhaseDelta{};
    Interpolator miShape{};
    float phaseAcc = 0.0f;
  } osc;
  struct {
    Interpolator miGain{};
    Interpolator miDrive{};
    Interpolator miVolume{};
  } voicingAmp;
};

inline void osc_processSamples(KickStateBus& bus, float* buffer, int len) {
  auto& osc = bus.osc;
  if (bus.gateTriggered) {
    osc.phaseAcc = 0.0f;
    osc.miPhaseDelta.reset();
    osc.miShape.reset();
  }
  
  const auto& sp = bus.parameters;
  const float prPitch = clampValue(
    sp.oscPitch + bus.pitchEgValue * sp.pitchEgAmount, 0.0f, 1.0f
  );
  const float phaseDelta = calcOscDelta(bus.noteNumber, prPitch, bus.sampleRate);
  osc.miPhaseDelta.feed(phaseDelta, len);
  osc.miShape.feed(sp.oscShape, len);
  
  for (int i = 0; i < len; i++) {
    const float pd = osc.miPhaseDelta.advance();
    const float prShape = osc.miShape.advance();
    osc.phaseAcc = fracPart(osc.phaseAcc + pd);
    const float y = getOscWaveformPd(osc.phaseAcc, PdOscWave::saw, prShape);
    buffer[i] = y;
  }
}

inline void pitchEg_advance(KickStateBus& bus) {
  const auto& sp = bus.parameters;
  const float timeMax = power3(sp.pitchEgTime) * 4.0f;
  const float timePos = (timeMax == 0.0f) ? 1.0f : 
    clampValue(bus.currentTime / timeMax, 0.0f, 1.0f);
  const float y = getEgWaveCurve(sp.pitchEgWave, timePos, sp.pitchEgShape);
  bus.pitchEgValue = y;
}

inline void ampEg_advance(KickStateBus& bus) {
  if (bus.gateOn) {
    const auto& sp = bus.parameters;
    const float timeMax = power3(sp.ampEgTime) * 4.0f;
    const float timePos = (timeMax == 0.0f) ? 1.0f :
      clampValue(bus.currentTime / timeMax, 0.0f, 1.0f);
    const float y = getEgWaveCurve(sp.ampEgWave, timePos, sp.ampEgShape);
    bus.ampEgValue = y;
    bus.ampToleLevel = y;
  } else {
    const float releaseTimeSec = 0.020f; // 20ms
    const float t = clampValue(bus.currentTime / releaseTimeSec, 0.0f, 1.0f);
    const float y = 1.0f - CurveMapper::riseInvCosine(t);
    bus.ampEgValue = y * bus.ampToleLevel;
  }
}

inline void voicingAmp_processSamples(KickStateBus& bus, float* buffer, int len) {
  auto& va = bus.voicingAmp;
  if (bus.gateTriggered) {
    va.miGain.reset();
    va.miDrive.reset();
    va.miVolume.reset();
  }
  
  const auto& sp = bus.parameters;
  va.miGain.feed(bus.ampEgValue, len);
  va.miDrive.feed(sp.ampDrive, len);
  va.miVolume.feed(sp.volume, len);
  
  for (int i = 0; i < len; i++) {
    const float gain = va.miGain.advance();
    const float drive = va.miDrive.advance();
    const float volume = va.miVolume.advance();
    float y = buffer[i] * gain;
    if (drive > 0.0f) {
      y = tunableSigmoid(y * (1.0f + drive * 16.0f), -drive * 0.95f);
    }
    buffer[i] = applySoftClip(y) * volume;
  }
}

class KickSynth {
private:
  KickStateBus bus{};

public:
  void prepare(float sampleRate, int maxFrames) {
    bus.sampleRate = sampleRate;
    bus.workBuffer.resize(maxFrames);
  }

  void applyPreset(KickPresetKey presetKey) {
    bus.parameters = kickPresets[static_cast<int>(presetKey)];
  }

  void processSamples(float* destBuffer, int len) {
    if (bus.sampleRate == 0.0f || bus.workBuffer.empty()) return;
    
    auto& buffer = bus.workBuffer;
    std::fill(buffer.begin(), buffer.begin() + len, 0.0f);
    
    const float timeLength = static_cast<float>(len) / bus.sampleRate;
    pitchEg_advance(bus);
    ampEg_advance(bus);
    osc_processSamples(bus, buffer.data(), len);
    voicingAmp_processSamples(bus, buffer.data(), len);
    writeBuffer(destBuffer, buffer.data(), len);
    
    bus.currentTime += timeLength;
    bus.gateTriggered = false;
  }

  void playTone() {
    bus.noteNumber = 32.0f;
    bus.currentTime = 0.0f;
    bus.gateOn = true;
    bus.gateTriggered = true;
  }

  void stopTone() {
    bus.gateOn = false;
    bus.currentTime = 0.0f;
  }
};

} // namespace dsp
