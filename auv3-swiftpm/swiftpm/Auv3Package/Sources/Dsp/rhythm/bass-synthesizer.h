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

enum class BassEgWave { ds, d, pd };

struct BassParametersSuit {
  float oscOctave = 0.0f;
  float oscShape = 0.0f;
  BassEgWave modEgWave = BassEgWave::ds;
  float modEgTime = 0.0f;
  float modEgShape = 0.0f;
  float modEgAmount = 0.0f;
  BassEgWave ampEgWave = BassEgWave::ds;
  float ampEgTime = 0.0f;
  float ampEgShape = 0.0f;
  float ampDrive = 0.0f;
  float volume = 0.0f;
};

static const auto bassPresets = []() {
  std::array<BassParametersSuit, 4> presets;
  presets[static_cast<int>(BassPresetKey::bass1)] = {
    0.0f, 1.0f, BassEgWave::ds, 0.2f, 1.0f, 0.8f,
    BassEgWave::ds, 0.55f, 1.0f, 0.0f, 1.0f
  };
  presets[static_cast<int>(BassPresetKey::bass2)] = {
    0.0f, 0.52f, BassEgWave::ds, 0.2f, 1.0f, 0.8f,
    BassEgWave::ds, 0.53f, 0.62f, 0.32f, 0.42f
  };
  presets[static_cast<int>(BassPresetKey::bass3)] = {
    0.0f, 0.0f, BassEgWave::ds, 0.6f, 0.78f, 0.97f,
    BassEgWave::ds, 0.5f, 1.0f, 0.0f, 1.0f
  };
  presets[static_cast<int>(BassPresetKey::bass4)] = {
    0.0f, 0.0f, BassEgWave::ds, 0.43f, 1.0f, 0.45f,
    BassEgWave::ds, 0.6f, 1.0f, 0.59f, 0.23f
  };
  return presets;
}();

inline float getEgWaveCurve_bass(BassEgWave wave, float x, float w) {
  if (wave == BassEgWave::ds) {
    const float base = w;
    return base + (1.0f - base) * mapExpCurve(1.0f - x);
  } else if (wave == BassEgWave::d) {
    const float scaler = mapUnaryTo(1.0f - w, 1.0f, 16.0f);
    return mapExpCurve(1.0f - x, scaler);
  } else if (wave == BassEgWave::pd) {
    if (x <= w) {
      return 1.0f;
    } else {
      const float u = linearInterpolate(x, w, 1.0f, 1.0f, 0.0f);
      return u * u;
    }
  }
  return 0.0f;
}

inline float calcOscDelta_bass(float noteNumber, float octave, float sampleRate) {
  const float frequency = midiToFrequency(noteNumber + octave * 12.0f);
  return frequency / sampleRate;
}

struct BassStateBus {
  BassParametersSuit parameters{};
  float sampleRate = 0.0f;
  bool gateOn = false;
  float uptime = 0.0f;
  float noteOffUptime = 0.0f;
  float noteDurationSec = -1.0f;
  float noteNumber = 24.0f;
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

inline float calcEgValue(BassStateBus& bus, BassEgWave prWave, float prTime, float prShape) {
  const float timeMax = power3(prTime) * 1.0f;
  const float timePos = (timeMax == 0.0f) ? 1.0f : 
    clampValue(bus.uptime / timeMax, 0.0f, 1.0f);
  return getEgWaveCurve_bass(prWave, timePos, prShape);
}

inline float getModEgValue(BassStateBus& bus) {
  const auto& sp = bus.parameters;
  return calcEgValue(bus, sp.modEgWave, sp.modEgTime, sp.modEgShape);
}

inline float calcAttackEgValue(BassStateBus& bus) {
  const float timeMaxSec = 0.002f; // 2ms
  if (bus.uptime < timeMaxSec) {
    const float t = clampValue(bus.uptime / timeMaxSec, 0.0f, 1.0f);
    return CurveMapper::riseInvCosine(t);
  }
  return 1.0f;
}

inline float calcReleaseEgValue(BassStateBus& bus) {
  const float timeMaxSec = 0.010f; // 10ms
  if (bus.noteOffUptime < timeMaxSec) {
    const float t = clampValue(bus.noteOffUptime / timeMaxSec, 0.0f, 1.0f);
    return 1.0f - CurveMapper::riseInvCosine(t);
  }
  return 0.0f;
}

inline float getAmpEgValue(BassStateBus& bus) {
  const auto& sp = bus.parameters;
  float val = calcEgValue(bus, sp.ampEgWave, sp.ampEgTime, sp.ampEgShape);
  val *= calcAttackEgValue(bus);
  if (!bus.gateOn) {
    val *= calcReleaseEgValue(bus);
  }
  return val;
}

inline void osc_processSamples_bass(BassStateBus& bus, float* buffer, int len) {
  auto& osc = bus.osc;
  if (bus.gateTriggered) {
    osc.phaseAcc = 0.0f;
    osc.miPhaseDelta.reset();
    osc.miShape.reset();
  }
  
  const auto& sp = bus.parameters;
  const float phaseDelta = calcOscDelta_bass(
    bus.noteNumber, sp.oscOctave, bus.sampleRate
  );
  osc.miPhaseDelta.feed(phaseDelta, len);
  const float prShape = clampValue(
    sp.oscShape + getModEgValue(bus) * sp.modEgAmount, 0.0f, 1.0f
  );
  osc.miShape.feed(prShape, len);
  
  for (int i = 0; i < len; i++) {
    const float pd = osc.miPhaseDelta.advance();
    const float shape = osc.miShape.advance();
    osc.phaseAcc = fracPart(osc.phaseAcc + pd);
    const float y = getOscWaveformPd(osc.phaseAcc, PdOscWave::saw, shape);
    buffer[i] = y;
  }
}

inline void voicingAmp_processSamples_bass(BassStateBus& bus, float* buffer, int len) {
  auto& va = bus.voicingAmp;
  const auto& sp = bus.parameters;
  if (bus.gateTriggered) {
    va.miGain.reset();
    va.miDrive.reset();
    va.miVolume.reset();
  }
  
  const float apmEgValue = getAmpEgValue(bus);
  va.miGain.feed(apmEgValue, len);
  va.miDrive.feed(sp.ampDrive, len);
  va.miVolume.feed(sp.volume, len);
  
  for (int i = 0; i < len; i++) {
    const float gain = va.miGain.advance();
    const float drive = va.miDrive.advance();
    const float volume = va.miVolume.advance();
    float y = buffer[i] * gain;
    if (drive > 0.0f) {
      y = tunableSigmoid(y * (1.0f + drive * 16.0f), -drive * 0.95f);
      y = applySoftClip(y);
    }
    buffer[i] = y * volume;
  }
}

class BassSynth {
private:
  BassStateBus bus{};

public:
  void prepare(float sampleRate, int maxFrames) {
    bus.sampleRate = sampleRate;
    bus.workBuffer.resize(maxFrames);
  }

  void applyPreset(BassPresetKey presetKey) {
    bus.parameters = bassPresets[static_cast<int>(presetKey)];
  }

  void processSamples(float* destBuffer, int len) {
    if (bus.sampleRate == 0.0f || bus.workBuffer.empty()) return;
    
    auto& buffer = bus.workBuffer;
    std::fill(buffer.begin(), buffer.begin() + len, 0.0f);
    
    const float timeLength = static_cast<float>(len) / bus.sampleRate;
    osc_processSamples_bass(bus, buffer.data(), len);
    voicingAmp_processSamples_bass(bus, buffer.data(), len);
    writeBuffer(destBuffer, buffer.data(), len);
    
    bus.uptime += timeLength;
    bus.noteOffUptime += timeLength;
    
    if (bus.gateOn && bus.noteDurationSec >= 0.0f && 
        bus.uptime > bus.noteDurationSec) {
      bus.gateOn = false;
      bus.noteOffUptime = 0.0f;
    }
    
    bus.gateTriggered = false;
  }

  void playTone(float noteNumber, float noteDurationSec = -1.0f) {
    if (noteDurationSec >= 0.0f && noteDurationSec <= 1e-6f) return;
    bus.noteNumber = noteNumber;
    bus.uptime = 0.0f;
    bus.noteOffUptime = 0.0f;
    bus.gateOn = true;
    bus.noteDurationSec = noteDurationSec;
    bus.gateTriggered = true;
  }

  void stopTone() {
    bus.gateOn = false;
    bus.noteOffUptime = 0.0f;
  }
};

} // namespace dsp
