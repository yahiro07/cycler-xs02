import { konsole } from "@core/ax/konsole";
import { power2 } from "@core/ax/number-utils";
import {
  applyBufferGain,
  applyBufferGainRms,
  applyBufferSoftClip,
  writeBuffer,
} from "@core/ax-audio/basic/buffer-functions";
import { mapDbGain } from "@core/ax-audio/basic/db-gain-mapper";
import { masterGainConfig } from "@core/ax-audio/basic/master-gain-config";
import { blWave2A_buildWaveTables } from "@core/ax-audio/oscillators/bl-wave-2a";
import { Bus, createSynthesisBus } from "@core/base/synthesis-bus";
import { getLoopBarsFromKey } from "@core/motions/funcs/steps-common";
import { gaterExSeqMode_setupLocalState } from "@core/motions/gaters/gater-ex-seq";
import { gaterMinLaxMode_setupLocalState } from "@core/motions/gaters/gater-main-lax";
import * as motions_root from "@core/motions/motions-root";
import {
  BassSynth,
  bassSynth_prepare,
  bassSynth_processSamples,
  createBassSynth,
} from "@core/rhythm/bass-synthesizer";
import {
  BeatDriver,
  beatDriver_advance,
  beatDriver_start,
  createBeatDriver,
} from "@core/rhythm/beat-driver";
import {
  createKickSynth,
  KickSynth,
  kickSynth_prepare,
  kickSynth_processSamples,
} from "@core/rhythm/kick-synthesizer";
import {
  createMainSynthesisLine,
  MainSynthesisLine,
  mainSynthesisLine_prepare,
  mainSynthesisLine_processSamples,
  mainSynthesisLine_reset,
} from "@core/synthesizer/main-synthesis-line";
import {
  createTriggerManager,
  TriggerManager,
  triggerManager_playNote,
  triggerManager_setGroovePlaying,
  triggerManager_stopNote,
  triggerManager_updateNoteStates,
} from "./trigger-manager";

const configs = {
  chunkSize: 32,
};

type ChunkBuffer = {
  buffer: Float32Array;
  readPos: number;
};

export type SynthesizerHub = {
  bus: Bus;
  mainSynth: MainSynthesisLine;
  kickSynth: KickSynth;
  bassSynth: BassSynth;
  beatDriver: BeatDriver;
  workBuffer: Float32Array;
  chunkBuffer: ChunkBuffer;
  triggerManager: TriggerManager;
};

export function createSynthesizerHub(): SynthesizerHub {
  const bus = createSynthesisBus();
  const mainSynth = createMainSynthesisLine(bus);

  const kickSynth = createKickSynth();
  const bassSynth = createBassSynth();
  const beatDriver = createBeatDriver(bus, kickSynth, bassSynth);
  const workBuffer = new Float32Array(0);
  const chunkBuffer = {
    buffer: new Float32Array(configs.chunkSize),
    readPos: 0,
  };
  const triggerManager = createTriggerManager(bus);
  return {
    bus,
    mainSynth,
    kickSynth,
    bassSynth,
    beatDriver,
    workBuffer,
    chunkBuffer,
    triggerManager,
  };
}

export function synthesizerHub_prepare(
  self: SynthesizerHub,
  sampleRate: number,
) {
  const maxFrames = configs.chunkSize;
  const { bus } = self;
  bus.sampleRate = sampleRate;
  bus.maxFrames = maxFrames;
  if (self.workBuffer.length !== maxFrames) {
    self.workBuffer = new Float32Array(maxFrames);
  }
  gaterMinLaxMode_setupLocalState(bus);
  gaterExSeqMode_setupLocalState(bus);
  mainSynthesisLine_prepare(self.mainSynth);
  kickSynth_prepare(self.kickSynth, sampleRate, maxFrames);
  bassSynth_prepare(self.bassSynth, sampleRate, maxFrames);
  konsole.log(`synthesizerHub_prepare ${sampleRate} ${maxFrames}`);
}

export function synthesizerHub_setGroovePlaying(
  self: SynthesizerHub,
  playing: boolean,
) {
  triggerManager_setGroovePlaying(self.triggerManager, playing);
}

export function synthesizerHub_playNote(
  self: SynthesizerHub,
  noteNumber: number,
) {
  triggerManager_playNote(self.triggerManager, noteNumber);
}

export function synthesizerHub_stopNote(self: SynthesizerHub) {
  triggerManager_stopNote(self.triggerManager);
}

export function synthesizerHub_setBpm(self: SynthesizerHub, bpm: number) {
  self.bus.bpm = bpm;
}

export function synthesizerHub_setParamVer(
  self: SynthesizerHub,
  paramVer: number,
) {
  self.bus.paramVer = paramVer;
}

function coreProcessSamples(self: SynthesizerHub, buffer: Float32Array) {
  const { bus, mainSynth, kickSynth, bassSynth, beatDriver } = self;
  const { sp } = bus;
  const { workBuffer } = self;

  bus.loopBars = getLoopBarsFromKey(sp.loopBars);

  if (bus.blockLength !== buffer.length) {
    bus.blockLength = buffer.length;
  }

  const gateTriggered = triggerManager_updateNoteStates(self.triggerManager);
  if (gateTriggered) {
    motions_root.reset(bus);
    mainSynthesisLine_reset(mainSynth);
    beatDriver_start(beatDriver);
  }

  motions_root.advance(bus);
  beatDriver_advance(beatDriver);

  if (bus.gateStepAdvanced && sp.ampOn && sp.ampEgHold < 1) {
    mainSynthesisLine_reset(mainSynth);
  }

  {
    workBuffer.fill(0);
    mainSynthesisLine_processSamples(mainSynth, workBuffer);
    writeBuffer(buffer, workBuffer, power2(sp.synthVolume));
  }
  {
    workBuffer.fill(0);
    kickSynth_processSamples(kickSynth, workBuffer);
    writeBuffer(buffer, workBuffer, power2(sp.kickVolume));
  }
  {
    workBuffer.fill(0);
    bassSynth_processSamples(bassSynth, workBuffer);
    writeBuffer(buffer, workBuffer, power2(sp.bassVolume));
  }
  applyBufferGainRms(buffer, 3);

  applyBufferGain(buffer, masterGainConfig.prescale);
  const masterGain = mapDbGain(sp.masterVolume, masterGainConfig);
  applyBufferGain(buffer, masterGain);
  applyBufferSoftClip(buffer);
  motions_root.processOnFrameEnd(bus);
}

function processSamplesWithChunks(
  self: SynthesizerHub,
  destBuffer: Float32Array,
  len: number,
) {
  if (len === 0) return;
  // 出力要求数が少ないときでも常にチャンクサイズ単位で波形生成を行い、
  // ノートやパラメタの状態を反映もチャンクサイズ境界でのみ行う

  const outBuf = self.chunkBuffer;
  for (let i = 0; i < len; i++) {
    //読み出し位置が先頭にあるときバッファ1面分の波形を生成
    if (outBuf.readPos === 0) {
      outBuf.buffer.fill(0);
      coreProcessSamples(self, outBuf.buffer);
    }
    //1サンプルずつとって出力バッファを埋める
    destBuffer[i] = outBuf.buffer[outBuf.readPos++];
    if (outBuf.readPos >= outBuf.buffer.length) {
      outBuf.readPos = 0;
    }
  }
}

export function synthesizerHub_processSamples(
  self: SynthesizerHub,
  buffer: Float32Array,
  len: number,
) {
  processSamplesWithChunks(self, buffer, len);
}

export function synthesizerHub_getBarPosition(self: SynthesizerHub): number {
  return (self.bus.totalStep / 16) >>> 0;
}

export function synthesizerHub_setupBlWaveTable(self: SynthesizerHub) {
  blWave2A_buildWaveTables(self.bus.blWave2A);
  konsole.log("synthesizerHub_setupBlWaveTable");
}
