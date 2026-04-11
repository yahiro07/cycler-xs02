import { Bus, createSynthesisBus } from "@core/base/synthesis-bus";
import {
  applyBufferGain,
  applyBufferGainRms,
  applyBufferSoftClip,
  writeBuffer,
} from "@core/dsp-modules/basic/buffer-functions";
import { mapDbGain } from "@core/dsp-modules/basic/db-gain-mapper";
import { masterGainConfig } from "@core/dsp-modules/basic/master-gain-config";
import { blWave2A_buildWaveTables } from "@core/dsp-modules/oscillators/bl-wave-2a";
import { getLoopBarsFromKey } from "@core/motions/funcs/steps-common";
import { gaterExSeqMode_setupLocalState } from "@core/motions/gaters/gater-ex-seq";
import { gaterMinLaxMode_setupLocalState } from "@core/motions/gaters/gater-main-lax";
import * as motions_root from "@core/motions/motions-root";
import { BassSynth } from "@core/rhythm/bass-synthesizer";
import { BeatDriver } from "@core/rhythm/beat-driver";
import { KickSynth } from "@core/rhythm/kick-synthesizer";
import { MainSynthesisLine } from "@core/synthesizer/main-synthesis-line";
import { konsole } from "@core/utils/konsole";
import { power2 } from "@core/utils/number-utils";
import { TriggerManager } from "./trigger-manager";

const configs = {
  chunkSize: 32,
};

type ChunkBuffer = {
  buffer: Float32Array;
  readPos: number;
};

export class SynthesizerHub {
  private bus: Bus;
  private mainSynth: MainSynthesisLine;
  private kickSynth: KickSynth;
  private bassSynth: BassSynth;
  private beatDriver: BeatDriver;
  private workBuffer: Float32Array;
  private chunkBuffer: ChunkBuffer;
  private triggerManager: TriggerManager;

  constructor() {
    const bus = createSynthesisBus();
    const mainSynth = new MainSynthesisLine(bus);

    const kickSynth = new KickSynth();
    const bassSynth = new BassSynth();
    const beatDriver = new BeatDriver(bus, kickSynth, bassSynth);
    const workBuffer = new Float32Array(0);
    const chunkBuffer = {
      buffer: new Float32Array(configs.chunkSize),
      readPos: 0,
    };
    const triggerManager = new TriggerManager(bus);
    this.bus = bus;
    this.mainSynth = mainSynth;
    this.kickSynth = kickSynth;
    this.bassSynth = bassSynth;
    this.beatDriver = beatDriver;
    this.workBuffer = workBuffer;
    this.chunkBuffer = chunkBuffer;
    this.triggerManager = triggerManager;
  }

  getBus() {
    return this.bus;
  }

  prepare(sampleRate: number) {
    const maxFrames = configs.chunkSize;
    const { bus } = this;
    bus.sampleRate = sampleRate;
    bus.maxFrames = maxFrames;
    if (this.workBuffer.length !== maxFrames) {
      this.workBuffer = new Float32Array(maxFrames);
    }
    gaterMinLaxMode_setupLocalState(bus);
    gaterExSeqMode_setupLocalState(bus);
    this.mainSynth.prepare();
    this.kickSynth.prepare(sampleRate, maxFrames);
    this.bassSynth.prepare(sampleRate, maxFrames);
    konsole.log(`synthesizerHub_prepare ${sampleRate} ${maxFrames}`);
  }

  setGroovePlaying(playing: boolean) {
    this.triggerManager.setGroovePlaying(playing);
  }

  noteOn(noteNumber: number) {
    this.triggerManager.playNote(noteNumber);
  }

  noteOff(noteNumber: number) {
    this.triggerManager.stopNote(noteNumber);
  }

  private coreProcessSamples(buffer: Float32Array) {
    const { bus } = this;
    const { sp } = bus;
    const { workBuffer } = this;

    bus.loopBars = getLoopBarsFromKey(sp.loopBars);

    if (bus.blockLength !== buffer.length) {
      bus.blockLength = buffer.length;
    }

    const gateTriggered = this.triggerManager.updateNoteStates();
    if (gateTriggered) {
      motions_root.reset(bus);
      this.mainSynth.reset();
      this.beatDriver.start();
    }

    motions_root.advance(bus);
    this.beatDriver.advance();

    if (bus.gateStepAdvanced && sp.ampOn && sp.ampEgHold < 1) {
      this.mainSynth.reset();
    }

    {
      workBuffer.fill(0);
      this.mainSynth.processSamples(workBuffer);
      writeBuffer(buffer, workBuffer, power2(sp.synthVolume));
    }
    {
      workBuffer.fill(0);
      this.kickSynth.processSamples(workBuffer);
      writeBuffer(buffer, workBuffer, power2(sp.kickVolume));
    }
    {
      workBuffer.fill(0);
      this.bassSynth.processSamples(workBuffer);
      writeBuffer(buffer, workBuffer, power2(sp.bassVolume));
    }
    applyBufferGainRms(buffer, 3);

    applyBufferGain(buffer, masterGainConfig.prescale);
    const masterGain = mapDbGain(sp.masterVolume, masterGainConfig);
    applyBufferGain(buffer, masterGain);
    applyBufferSoftClip(buffer);
    motions_root.processOnFrameEnd(bus);
  }

  private processSamplesWithChunks(destBuffer: Float32Array, len: number) {
    if (len === 0) return;
    // Even when the number of output requests is small, waveforms are always generated in chunks,
    // and changes to note and parameter states are applied only at chunk boundaries

    const outBuf = this.chunkBuffer;
    for (let i = 0; i < len; i++) {
      // Generate a waveform for one buffer page when the read position is at the beginning
      if (outBuf.readPos === 0) {
        outBuf.buffer.fill(0);
        this.coreProcessSamples(outBuf.buffer);
      }
      //Fill the output buffer by taking one sample at a time
      destBuffer[i] = outBuf.buffer[outBuf.readPos++];
      if (outBuf.readPos >= outBuf.buffer.length) {
        outBuf.readPos = 0;
      }
    }
  }

  processSamples(buffer: Float32Array, len: number) {
    this.processSamplesWithChunks(buffer, len);
  }

  // getBarPosition(): number {
  //   return (this.bus.totalStep / 16) >>> 0;
  // }

  setupBlWaveTable() {
    blWave2A_buildWaveTables(this.bus.blWave2A);
    konsole.log("synthesizerHub_setupBlWaveTable");
  }
}
