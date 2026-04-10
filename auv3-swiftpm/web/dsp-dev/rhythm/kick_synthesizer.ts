import {
  clampValue,
  fracPart,
  linearInterpolate,
  mapUnaryTo,
  power3,
  tunableSigmoid,
} from "@core/ax/number_utils";
import { writeBuffer } from "@core/ax-audio/basic/buffer_functions";
import { curveMapper, mapExpCurve } from "@core/ax-audio/basic/curves";
import {
  createInterpolator,
  Interpolator,
} from "@core/ax-audio/basic/interpolator";
import { midiToFrequency } from "@core/ax-audio/basic/synthesis_helper";
import { applySoftClip } from "@core/ax-audio/effects/soft_clip_shaper";
import { getOscWaveformPd } from "@core/ax-audio/oscillators/pd_waves";
import { KickPresetKey } from "@core/base/parameter_defs";

export enum KickEgWave {
  ds,
  d,
  pd,
}

export type KickParametersSuit = {
  oscPitch: number;
  oscShape: number;
  pitchEgWave: KickEgWave;
  pitchEgTime: number;
  pitchEgShape: number;
  pitchEgAmount: number;
  ampEgWave: KickEgWave;
  ampEgTime: number;
  ampEgShape: number;
  ampDrive: number;
  volume: number;
};

const kickPresets = {
  [KickPresetKey.kick1]: {
    oscPitch: 0.44,
    oscShape: 0.3,
    pitchEgWave: KickEgWave.ds,
    pitchEgTime: 0.3,
    pitchEgShape: 0,
    pitchEgAmount: 0.53,
    ampEgWave: KickEgWave.d,
    ampEgTime: 0.63,
    ampEgShape: 0.6,
    ampDrive: 0.05,
    volume: 0.66,
  },
  [KickPresetKey.kick2]: {
    oscPitch: 0.32,
    oscShape: 0.5,
    pitchEgWave: KickEgWave.ds,
    pitchEgTime: 0.23,
    pitchEgShape: 0.21,
    pitchEgAmount: 0.74,
    ampEgWave: KickEgWave.d,
    ampEgTime: 0.52,
    ampEgShape: 0.38,
    ampDrive: 0.28,
    volume: 1,
  },
  [KickPresetKey.kick3]: {
    oscPitch: 0.34,
    oscShape: 0.61,
    pitchEgWave: KickEgWave.ds,
    pitchEgTime: 0.26,
    pitchEgShape: 0.12,
    pitchEgAmount: 0.74,
    ampEgWave: KickEgWave.pd,
    ampEgTime: 0.41,
    ampEgShape: 0.39,
    ampDrive: 0,
    volume: 0.61,
  },
  [KickPresetKey.kick4]: {
    oscPitch: 0.32,
    oscShape: 0.32,
    pitchEgWave: KickEgWave.ds,
    pitchEgTime: 0.29,
    pitchEgShape: 0.23,
    pitchEgAmount: 0.68,
    ampEgWave: KickEgWave.pd,
    ampEgTime: 0.55,
    ampEgShape: 0.51,
    ampDrive: 0,
    volume: 0.46,
  },
  [KickPresetKey.kick5]: {
    oscPitch: 0.34,
    oscShape: 0.78,
    pitchEgWave: KickEgWave.ds,
    pitchEgTime: 0.42,
    pitchEgShape: 0.07,
    pitchEgAmount: 0.73,
    ampEgWave: KickEgWave.d,
    ampEgTime: 0.6,
    ampEgShape: 0.38,
    ampDrive: 0.21,
    volume: 0.24,
  },
} satisfies Record<KickPresetKey, KickParametersSuit>;

const defaultKickParameters = kickPresets[KickPresetKey.kick1];

function getEgWaveCurve(wave: KickEgWave, x: number, w: number) {
  if (wave === KickEgWave.ds) {
    const base = w;
    return base + (1 - base) * mapExpCurve(1 - x);
  } else if (wave === KickEgWave.d) {
    const scaler = mapUnaryTo(1 - w, 1, 16);
    return mapExpCurve(1 - x, scaler);
  } else if (wave === KickEgWave.pd) {
    if (x <= w) {
      return 1;
    } else {
      const u = linearInterpolate(x, w, 1, 1, 0);
      return u * u;
    }
  }
  return 0;
}

function calcOscDelta(noteNumber: number, prPitch: number, sampleRate: number) {
  let relNoteValue = 0;
  const notesHalfRange = 24;
  relNoteValue = mapUnaryTo(prPitch, -notesHalfRange, notesHalfRange);
  const modNoteNumber = noteNumber + relNoteValue;
  const frequency = midiToFrequency(modNoteNumber) * 1;
  return frequency / sampleRate;
}

type StateBus = {
  parameters: KickParametersSuit;
  sampleRate: number;
  ampEgValue: number;
  pitchEgValue: number;
  noteNumber: number;
  currentTime: number;
  gateOn: boolean;
  ampToleLevel: number;
  gateTriggered: boolean;
  workBuffer: Float32Array | undefined;
  osc: {
    miPhaseDelta: Interpolator;
    miShape: Interpolator;
    phaseAcc: number;
  };
  voicingAmp: {
    miGain: Interpolator;
    miDrive: Interpolator;
    miVolume: Interpolator;
  };
};

function osc_processSamples(bus: StateBus, buffer: Float32Array) {
  const { osc } = bus;
  const { miPhaseDelta, miShape } = osc;
  if (bus.gateTriggered) {
    osc.phaseAcc = 0;
    miPhaseDelta.reset();
    miShape.reset();
  }
  const sp = bus.parameters;
  const n = buffer.length;
  const prPitch = clampValue(
    sp.oscPitch + bus.pitchEgValue * sp.pitchEgAmount,
    0,
    1,
  );
  const _phaseDelta = calcOscDelta(bus.noteNumber, prPitch, bus.sampleRate);
  miPhaseDelta.feed(_phaseDelta, n);
  miShape.feed(sp.oscShape, n);

  for (let i = 0; i < buffer.length; i++) {
    const phaseDelta = miPhaseDelta.advance();
    const prShape = miShape.advance();
    osc.phaseAcc = fracPart(osc.phaseAcc + phaseDelta);
    const y = getOscWaveformPd(osc.phaseAcc, "saw", prShape);
    buffer[i] = y;
  }
}

function pitchEg_advance(bus: StateBus) {
  const sp = bus.parameters;
  const prWave = sp.pitchEgWave;
  const prTime = sp.pitchEgTime;
  const prShape = sp.pitchEgShape;
  const timeMax = power3(prTime) * 4;
  const timePos =
    timeMax === 0 ? 1 : clampValue(bus.currentTime / timeMax, 0, 1);
  const y = getEgWaveCurve(prWave, timePos, prShape);
  bus.pitchEgValue = y;
}

function ampEg_advance(bus: StateBus) {
  if (bus.gateOn) {
    const sp = bus.parameters;
    const prWave = sp.ampEgWave;
    const prTime = sp.ampEgTime;
    const prShape = sp.ampEgShape;
    const timeMax = power3(prTime) * 4;
    const timePos =
      timeMax === 0 ? 1 : clampValue(bus.currentTime / timeMax, 0, 1);
    const y = getEgWaveCurve(prWave, timePos, prShape);
    bus.ampEgValue = y;
    bus.ampToleLevel = y;
  } else {
    const releaseTimeMs = 20;
    const releaseTimeSec = releaseTimeMs / 1000;
    const t = clampValue(bus.currentTime / releaseTimeSec, 0, 1);
    const y = 1 - curveMapper.riseInvCosine(t);
    bus.ampEgValue = y * bus.ampToleLevel;
  }
}

function voicingAmp_processSamples(bus: StateBus, buffer: Float32Array) {
  const { miGain, miDrive, miVolume } = bus.voicingAmp;
  if (bus.gateTriggered) {
    miGain.reset();
    miDrive.reset();
    miVolume.reset();
  }
  const sp = bus.parameters;
  miGain.feed(bus.ampEgValue, buffer.length);
  miDrive.feed(sp.ampDrive, buffer.length);
  miVolume.feed(sp.volume, buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    const gain = miGain.advance();
    const drive = miDrive.advance();
    const volume = miVolume.advance();
    let y = buffer[i] * gain;
    if (drive > 0) {
      y = tunableSigmoid(y * (1 + drive * 16), -drive * 0.95);
    }
    buffer[i] = applySoftClip(y) * volume;
  }
}

export type KickSynth = StateBus;

export function createKickSynth(): KickSynth {
  return {
    parameters: defaultKickParameters,
    sampleRate: 0,
    ampEgValue: 0,
    pitchEgValue: 0,
    noteNumber: 60,
    currentTime: 0,
    gateOn: false,
    ampToleLevel: 0,
    gateTriggered: false,
    workBuffer: undefined,
    osc: {
      miPhaseDelta: createInterpolator(),
      miShape: createInterpolator(),
      phaseAcc: 0,
    },
    voicingAmp: {
      miGain: createInterpolator(),
      miDrive: createInterpolator(),
      miVolume: createInterpolator(),
    },
  };
}

export function kickSynth_prepare(
  self: KickSynth,
  sampleRate: number,
  maxFrames: number,
) {
  const bus = self;
  bus.sampleRate = sampleRate;
  if (!(bus.workBuffer && bus.workBuffer.length === maxFrames)) {
    bus.workBuffer = new Float32Array(maxFrames);
  }
}

export function kickSynth_applyPreset(
  self: KickSynth,
  presetKey: KickPresetKey,
) {
  const bus = self;
  Object.assign(bus.parameters, kickPresets[presetKey]);
}

export function kickSynth_processSamples(
  self: KickSynth,
  destBuffer: Float32Array,
) {
  const bus = self;
  if (bus.sampleRate === 0 || !bus.workBuffer) return;
  const buffer = bus.workBuffer;
  buffer.fill(0);
  const timeLength = buffer.length / bus.sampleRate;
  pitchEg_advance(bus);
  ampEg_advance(bus);
  osc_processSamples(bus, buffer);
  voicingAmp_processSamples(bus, buffer);
  writeBuffer(destBuffer, buffer);
  bus.currentTime += timeLength;
  bus.gateTriggered = false;
}

export function kickSynth_playTone(self: KickSynth) {
  const bus = self;
  bus.noteNumber = 32;
  bus.currentTime = 0;
  bus.gateOn = true;
  bus.gateTriggered = true;
}

export function kickSynth_stopTone(self: KickSynth) {
  const bus = self;
  bus.gateOn = false;
  bus.currentTime = 0;
}
