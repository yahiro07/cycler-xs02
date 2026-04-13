#pragma once
#include "../base/master-gain-config.h"
#include "../base/synthesis-bus.h"
#include "../dsp-modules/basic/buffer-functions.h"
#include "../dsp-modules/basic/db-gain-mapper.h"
#include "../motions/motions-root.h"
#include "../rhythm/bass-synthesizer.h"
#include "../rhythm/beat-driver.h"
#include "../rhythm/kick-synthesizer.h"
#include "../utils/number-utils.h"
#include "main-synthesis-line.h"
#include "silence-checker.h"
#include "trigger-manager.h"

namespace dsp {

constexpr int CHUNK_SIZE = 32;

struct ChunkBuffer {
  float buffer[CHUNK_SIZE] = {0.f};
  int readPos = 0;
  int size = CHUNK_SIZE;

  ChunkBuffer() {}
};

class SynthesizerHub {
private:
  SynthesisBus bus;
  MainSynthesisLine mainSynth;
  KickSynth kickSynth;
  BassSynth bassSynth;
  BeatDriver beatDriver;
  TriggerManager triggerManager;
  SilenceChecker silenceChecker;
  float workBuffer[CHUNK_SIZE] = {0.f};
  ChunkBuffer chunkBuffer;

  void coreProcessSamples(float *buffer, int len) {
    debugAssert(len == CHUNK_SIZE, "invalid processing length");

    const auto &sp = bus.parameters;

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

    clearBuffer(workBuffer, len);
    mainSynth.processSamples(workBuffer, len);
    writeBufferWithGain(buffer, workBuffer, len, power2(sp.synthVolume));
    clearBuffer(workBuffer, len);
    kickSynth.processSamples(workBuffer, len);
    writeBufferWithGain(buffer, workBuffer, len, power2(sp.kickVolume));
    clearBuffer(workBuffer, len);
    bassSynth.processSamples(workBuffer, len);
    writeBufferWithGain(buffer, workBuffer, len, power2(sp.bassVolume));

    applyBufferGainRms(buffer, len, 3.0f);

    applyBufferGain(buffer, len, masterGainConfig.prescale);
    const float masterGain = mapDbGain(sp.masterVolume, masterGainConfig);
    applyBufferGain(buffer, len, masterGain);
    applyBufferSoftClip(buffer, len);

    motionsRoot_processOnFrameEnd(bus);
    silenceChecker.update(buffer, len);
  }

  void processSamplesWithChunks(float *destBuffer, int len) {
    if (len == 0)
      return;

    auto &outBuf = chunkBuffer;
    for (int i = 0; i < len; i++) {
      if (outBuf.readPos == 0) {
        clearBuffer(outBuf.buffer, outBuf.size);
        coreProcessSamples(outBuf.buffer, outBuf.size);
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
        triggerManager(bus), silenceChecker(bus) {}

  ~SynthesizerHub() {
    gaterMainLaxMode_cleanupLocalState(bus);
    gaterExSeqMode_cleanupLocalState(bus);
  }

  SynthesisBus &getBus() { return bus; }

  void prepare(float sampleRate) {
    constexpr int maxFrames = CHUNK_SIZE;
    bus.sampleRate = sampleRate;
    bus.maxFrames = maxFrames;
    blWaveProvider.setupTables();
    gaterMainLaxMode_setupLocalState(bus);
    gaterExSeqMode_setupLocalState(bus);

    mainSynth.prepare();
    kickSynth.prepare(sampleRate, maxFrames);
    bassSynth.prepare(sampleRate, maxFrames);

    konsole.debugLog("synthesizerHub.prepare %.1f %d", sampleRate, maxFrames);
  }

  void setGroovePlaying(bool playing) {
    triggerManager.setGroovePlaying(playing);
    silenceChecker.wakeUp();
  }

  void noteOn(int noteNumber) {
    triggerManager.playNote(noteNumber);
    silenceChecker.wakeUp();
  }

  void noteOff(int noteNumber) { triggerManager.stopNote(noteNumber); }

  void processSamples(float *buffer, int len) {
    if (!silenceChecker.isSoundActive()) {
      return;
    }
    processSamplesWithChunks(buffer, len);
  }
};

} // namespace dsp
