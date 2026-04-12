#pragma once
#include "../base/parameter-defs.h"
#include "../base/synthesis-bus.h"
#include "../dsp-modules/basic/synthesis-helper.h"
#include "../dsp-modules/filters/oversampling-stage.h"
#include "../motions/funcs/pitch-mapping.h"
#include "oscillator-core.h"
#include <memory>
#include <vector>

namespace dsp {

struct VoiceSpec {
  float octaveRatio = 0.0f;
  float detune = 0.0f;
  float gain = 0.0f;
};

class Oscillators {
private:
  SynthesisBus &bus;
  std::vector<OscillatorCore> oscs;
  std::unique_ptr<OversamplingStage> ovsStage;
  std::vector<VoiceSpec> voiceSpecs;
  int voiceIndex = 0;
  constexpr static int ovsRate = 4;
  constexpr static int maxVoices = 6;

  float calcNormFreq() {
    const auto &sp = bus.parameters;
    const auto &interm = bus.interm;

    float noteNumber = 0.0f;
    if (sp.oscPitchMoSmooth) {
      noteNumber = bus.noteNumber + interm.pmxOscRelNote + sp.oscOctave * 12.0f;
    } else {
      noteNumber = bus.noteNumber +
                   mapParamOscPitchToRelativeNote(interm.pmxOscPrPitch,
                                                  sp.oscPitchMode) +
                   sp.oscOctave * 12.0f;
    }
    const float oscSampleRate = bus.sampleRate * ovsRate;
    return midiToFrequency(noteNumber) / oscSampleRate;
  }

  void resetVoiceAssigns() { voiceIndex = 0; }

  void addVoice(float octaveRatio, float detune, float gain) {
    if (voiceIndex >= maxVoices)
      return;
    auto &vo = voiceSpecs[voiceIndex];
    vo.octaveRatio = octaveRatio;
    vo.detune = detune;
    vo.gain = gain;
    voiceIndex++;
  }

  void assignVoices() {
    const auto &sp = bus.parameters;
    const auto &interm = bus.interm;
    const OscUnisonMode pileMode = sp.oscUnisonMode;
    const float det = power3(sp.oscUnisonDetune) * 0.03f;

    const float crossMixRateKey =
        (sp.oscPitchMode == OscPitchMode::oct_x)
            ? mapParamOscPitchToOctXCrossMixRateKey(interm.pmxOscPrPitch)
            : -1.0f;

    resetVoiceAssigns();

    if (pileMode == OscUnisonMode::one) {
      addVoice(1.0f, 0.0f, 1.0f);
    } else if (pileMode == OscUnisonMode::det2) {
      addVoice(1.0f, -det, 0.5f);
      addVoice(1.0f, det, 0.5f);
    } else if (pileMode == OscUnisonMode::det3) {
      addVoice(1.0f, -det, 0.1f);
      addVoice(1.0f, 0.0f, 0.8f);
      addVoice(1.0f, det, 0.1f);
    } else if (pileMode == OscUnisonMode::sub) {
      addVoice(1.0f, -det, 0.5f);
      addVoice(0.5f, det, 0.5f);
    } else if (pileMode == OscUnisonMode::fifth) {
      addVoice(1.0f, -det, 0.5f);
      addVoice(1.5f, det, 0.5f);
    }

    if (crossMixRateKey >= 0.0f) {
      const unsigned int intKey = static_cast<unsigned int>(crossMixRateKey);
      const bool isOdd = (intKey & 1) != 0;
      const float upperMix =
          crossMixRateKey -
          static_cast<float>(static_cast<int>(crossMixRateKey));
      const float wa = m_sqrt(1.0f - upperMix);
      const float wb = m_sqrt(upperMix);
      const int numVoices = voiceIndex;

      for (int i = 0; i < numVoices; i++) {
        const auto &vo = voiceSpecs[i];
        addVoice(vo.octaveRatio, vo.detune, vo.gain);
      }

      if (isOdd) {
        for (int i = 0; i < numVoices; i++) {
          voiceSpecs[i].gain *= wa;
        }
        for (int i = numVoices; i < voiceIndex; i++) {
          voiceSpecs[i].octaveRatio *= 2.0f;
          voiceSpecs[i].gain *= wb;
        }
      } else {
        for (int i = 0; i < numVoices; i++) {
          voiceSpecs[i].octaveRatio *= 2.0f;
          voiceSpecs[i].gain *= wb;
        }
        for (int i = numVoices; i < voiceIndex; i++) {
          voiceSpecs[i].gain *= wa;
        }
      }
    }
  }

  void processSamplesInternal(float *buffer, int len, float normFreq) {
    for (int i = 0; i < voiceIndex; i++) {
      const auto &vo = voiceSpecs[i];
      oscs[i].processSamples(
          buffer, len, normFreq * vo.octaveRatio * (1.0f + vo.detune), vo.gain);
    }
  }

public:
  explicit Oscillators(SynthesisBus &bus)
      : bus(bus), ovsStage(std::make_unique<OversamplingStage>(ovsRate, 1.0f)) {
    oscs.reserve(maxVoices);
    for (int i = 0; i < maxVoices; i++) {
      oscs.emplace_back(bus);
    }
    voiceSpecs.resize(maxVoices);
  }

  void reset() {
    for (auto &osc : oscs) {
      osc.reset();
    }
  }

  void prepare() { ovsStage->ensureAllocated(bus.maxFrames); }

  void processSamples(float *buffer, int len) {
    const auto &sp = bus.parameters;
    if (!sp.oscOn)
      return;

    assignVoices();

    const float normFreq = calcNormFreq();

    float *highResBuffer = ovsStage->readIn(buffer, len, false);
    if (!highResBuffer)
      return;

    processSamplesInternal(highResBuffer, len * ovsRate, normFreq);
    ovsStage->writeOut();
  }
};

} // namespace dsp
