#pragma once
#include "../base/master-gain-config.h"
#include "../base/synthesis-bus.h"
#include "../dsp-modules/basic/buffer-functions.h"
#include "../dsp-modules/basic/db-gain-mapper.h"
#include "../motions/funcs/steps-common.h"
#include "../motions/motions-root.h"
#include "../rhythm/bass-synthesizer.h"
#include "../rhythm/beat-driver.h"
#include "../rhythm/kick-synthesizer.h"
#include "../utils/konsole.h"
#include "../utils/number-utils.h"
#include "main-synthesis-line.h"
#include "trigger-manager.h"
#include <vector>

namespace dsp {

constexpr int CHUNK_SIZE = 32;

struct ChunkBuffer {
  std::vector<float> buffer;
  int readPos = 0;
  int size = CHUNK_SIZE;

  ChunkBuffer() : buffer(CHUNK_SIZE, 0.0f) {}
};

class SynthesizerHub {
private:
  SynthesisBus bus;
  MainSynthesisLine mainSynth;
  KickSynth kickSynth;
  BassSynth bassSynth;
  BeatDriver beatDriver;
  TriggerManager triggerManager;
  std::vector<float> workBuffer;
  ChunkBuffer chunkBuffer;

  void coreProcessSamples(float *buffer, int len) {
    const auto &sp = bus.parameters;

    bus.loopBars = getLoopBarsFromKey(static_cast<LoopBarsKey>(bus.loopBars));

    if (bus.blockLength != len) {
      bus.blockLength = len;
    }

    const bool gateTriggered = triggerManager.updateNoteStates();

    if (gateTriggered) {
      motionsRoot_reset(bus);
      mainSynth.reset();
      beatDriver.start();
    }

    motionsRoot_advance(bus);
    beatDriver.advance();

    if (bus.gateStepAdvanced && sp.ampOn && sp.ampEgHold < 1.0f) {
      mainSynth.reset();
    }

    kickSynth.applyPreset(sp.kickPresetKey);
    bassSynth.applyPreset(sp.bassPresetKey);

    std::fill(workBuffer.begin(), workBuffer.end(), 0.0f);
    mainSynth.processSamples(workBuffer.data(), len);
    writeBufferWithGain(buffer, workBuffer.data(), len, power2(sp.synthVolume));
    std::fill(workBuffer.begin(), workBuffer.end(), 0.0f);
    kickSynth.processSamples(workBuffer.data(), len);
    writeBufferWithGain(buffer, workBuffer.data(), len, power2(sp.kickVolume));
    std::fill(workBuffer.begin(), workBuffer.end(), 0.0f);
    bassSynth.processSamples(workBuffer.data(), len);
    writeBufferWithGain(buffer, workBuffer.data(), len, power2(sp.bassVolume));

    applyBufferGainRms(buffer, len, 3.0f);

    applyBufferGain(buffer, len, masterGainConfig.prescale);
    const float masterGain = mapDbGain(sp.masterVolume, masterGainConfig);
    applyBufferGain(buffer, len, masterGain);
    applyBufferSoftClip(buffer, len);

    motionsRoot_processOnFrameEnd(bus);
  }

  void processSamplesWithChunks(float *destBuffer, int len) {
    if (len == 0)
      return;

    auto &outBuf = chunkBuffer;
    for (int i = 0; i < len; i++) {
      if (outBuf.readPos == 0) {
        std::fill(outBuf.buffer.begin(), outBuf.buffer.end(), 0.0f);
        coreProcessSamples(outBuf.buffer.data(), outBuf.size);
      }
      destBuffer[i] = outBuf.buffer[outBuf.readPos++];
      if (outBuf.readPos >= outBuf.size) {
        outBuf.readPos = 0;
      }
    }
  }

public:
  SynthesizerHub()
      : mainSynth(bus), beatDriver(bus, kickSynth, bassSynth),
        triggerManager(bus) {
    workBuffer.resize(CHUNK_SIZE);
  }

  ~SynthesizerHub() {
    gaterMainLaxMode_cleanupLocalState(bus);
    gaterExSeqMode_cleanupLocalState(bus);
  }

  SynthesisBus &getBus() { return bus; }

  void prepare(float sampleRate) {
    constexpr int maxFrames = CHUNK_SIZE;
    bus.sampleRate = sampleRate;
    bus.maxFrames = maxFrames;

    if (workBuffer.size() != static_cast<size_t>(maxFrames)) {
      workBuffer.resize(maxFrames);
    }
    blWaveProvider.setupTables();
    gaterMainLaxMode_setupLocalState(bus);
    gaterExSeqMode_setupLocalState(bus);

    mainSynth.prepare();
    kickSynth.prepare(sampleRate, maxFrames);
    bassSynth.prepare(sampleRate, maxFrames);

    konsole.debugLog("synthesizerHub_prepare %.1f %d", sampleRate, maxFrames);
  }

  void setGroovePlaying(bool playing) {
    triggerManager.setGroovePlaying(playing);
  }

  void noteOn(int noteNumber) { triggerManager.playNote(noteNumber); }

  void noteOff(int noteNumber) { triggerManager.stopNote(noteNumber); }

  void processSamples(float *buffer, int len) {
    processSamplesWithChunks(buffer, len);
  }
};

} // namespace dsp
