import { BassPresetKey } from "@core/base/parameter-defs";
import { writeBuffer } from "@core/dsp-modules/basic/buffer-functions";
import { curveMapper, mapExpCurve } from "@core/dsp-modules/basic/curves";
import {
  createInterpolator,
  Interpolator,
} from "@core/dsp-modules/basic/interpolator";
import { midiToFrequency } from "@core/dsp-modules/basic/synthesis-helper";
import { applySoftClip } from "@core/dsp-modules/effects/soft-clip-shaper";
import { getOscWaveformPd } from "@core/dsp-modules/oscillators/pd-waves";
import {
  clampValue,
  fracPart,
  linearInterpolate,
  mapUnaryTo,
  power3,
  tunableSigmoid,
} from "@core/utils/number-utils";

export enum BassEgWave {
  ds,
  d,
  pd,
}

export type BassParametersSuit = {
  oscOctave: number;
  oscShape: number;
  modEgWave: BassEgWave;
  modEgTime: number;
  modEgShape: number;
  modEgAmount: number;
  ampEgWave: BassEgWave;
  ampEgTime: number;
  ampEgShape: number;
  ampDrive: number;
  volume: number;
};

const bassPresets = {
  [BassPresetKey.bass1]: {
    oscOctave: 0,
    oscShape: 1,
    modEgWave: BassEgWave.ds,
    modEgTime: 0.2,
    modEgShape: 1,
    modEgAmount: 0.8,
    ampEgWave: BassEgWave.ds,
    ampEgTime: 0.55,
    ampEgShape: 1,
    ampDrive: 0,
    volume: 1,
  },
  [BassPresetKey.bass2]: {
    oscOctave: 0,
    oscShape: 0.52,
    modEgWave: BassEgWave.ds,
    modEgTime: 0.2,
    modEgShape: 1,
    modEgAmount: 0.8,
    ampEgWave: BassEgWave.ds,
    ampEgTime: 0.53,
    ampEgShape: 0.62,
    ampDrive: 0.32,
    volume: 0.42,
  },
  [BassPresetKey.bass3]: {
    oscOctave: 0,
    oscShape: 0,
    modEgWave: BassEgWave.ds,
    modEgTime: 0.6,
    modEgShape: 0.78,
    modEgAmount: 0.97,
    ampEgWave: BassEgWave.ds,
    ampEgTime: 0.5,
    ampEgShape: 1,
    ampDrive: 0,
    volume: 1,
  },
  [BassPresetKey.bass4]: {
    oscOctave: 0,
    oscShape: 0,
    modEgWave: BassEgWave.ds,
    modEgTime: 0.43,
    modEgShape: 1,
    modEgAmount: 0.45,
    ampEgWave: BassEgWave.ds,
    ampEgTime: 0.6,
    ampEgShape: 1,
    ampDrive: 0.59,
    volume: 0.23,
  },
} satisfies Record<BassPresetKey, BassParametersSuit>;

const defaultParameters = bassPresets[BassPresetKey.bass1];

function getEgWaveCurve(wave: BassEgWave, x: number, w: number) {
  if (wave === BassEgWave.ds) {
    const base = w;
    return base + (1 - base) * mapExpCurve(1 - x);
  } else if (wave === BassEgWave.d) {
    const scaler = mapUnaryTo(1 - w, 1, 16);
    return mapExpCurve(1 - x, scaler);
  } else if (wave === BassEgWave.pd) {
    if (x <= w) {
      return 1;
    } else {
      const u = linearInterpolate(x, w, 1, 1, 0);
      return u * u;
    }
  }
  return 0;
}

function calcOscDelta(noteNumber: number, octave: number, sampleRate: number) {
  const frequency = midiToFrequency(noteNumber + octave * 12);
  return frequency / sampleRate;
}

type StateBus = {
  parameters: BassParametersSuit;
  sampleRate: number;
  gateOn: boolean;
  uptime: number;
  noteOffUptime: number;
  noteDurationSec: number | undefined;
  noteNumber: number;
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

function calcEgValue(
  bus: StateBus,
  prWave: BassEgWave,
  prTime: number,
  prShape: number,
) {
  const timeMax = power3(prTime) * 1.0;
  const timePos = timeMax === 0 ? 1 : clampValue(bus.uptime / timeMax, 0, 1);
  return getEgWaveCurve(prWave, timePos, prShape);
}

function getModEgValue(bus: StateBus) {
  const sp = bus.parameters;
  return calcEgValue(bus, sp.modEgWave, sp.modEgTime, sp.modEgShape);
}

function calcAttackEgValue(bus: StateBus) {
  // Short attack (0→1) to suppress clicks immediately after a noteOn event
  const timeMaxMs = 2;
  const timeMaxSec = timeMaxMs / 1000;
  if (bus.uptime < timeMaxSec) {
    const t = clampValue(bus.uptime / timeMaxSec, 0, 1);
    return curveMapper.riseInvCosine(t);
  }
  return 1;
}

function calcReleaseEgValue(bus: StateBus) {
  const timeMaxMs = 10;
  const timeMaxSec = timeMaxMs / 1000;
  if (bus.noteOffUptime < timeMaxSec) {
    const t = clampValue(bus.noteOffUptime / timeMaxSec, 0, 1);
    return 1 - curveMapper.riseInvCosine(t);
  }
  return 0;
}

function getAmpEgValue(bus: StateBus) {
  const sp = bus.parameters;
  let val = calcEgValue(bus, sp.ampEgWave, sp.ampEgTime, sp.ampEgShape);
  val *= calcAttackEgValue(bus);
  if (!bus.gateOn) {
    val *= calcReleaseEgValue(bus);
  }
  return val;
}

function osc_processSamples(bus: StateBus, buffer: Float32Array) {
  const { osc } = bus;
  const { miPhaseDelta, miShape } = osc;
  if (bus.gateTriggered) {
    osc.phaseAcc = 0;
    miPhaseDelta.reset();
    miShape.reset();
  }
  {
    const n = buffer.length;
    const sp = bus.parameters;
    const phaseDelta = calcOscDelta(
      bus.noteNumber,
      sp.oscOctave,
      bus.sampleRate,
    );
    miPhaseDelta.feed(phaseDelta, n);
    const prShape = clampValue(
      sp.oscShape + getModEgValue(bus) * sp.modEgAmount,
      0,
      1,
    );
    miShape.feed(prShape, n);
  }

  for (let i = 0; i < buffer.length; i++) {
    const phaseDelta = miPhaseDelta.advance();
    const prShape = miShape.advance();
    osc.phaseAcc = fracPart(osc.phaseAcc + phaseDelta);
    const y = getOscWaveformPd(osc.phaseAcc, "saw", prShape);
    buffer[i] = y;
  }
}

function voicingAmp_processSamples(bus: StateBus, buffer: Float32Array) {
  const { miGain, miDrive, miVolume } = bus.voicingAmp;
  const sp = bus.parameters;
  if (bus.gateTriggered) {
    miGain.reset();
    miDrive.reset();
    miVolume.reset();
  }
  const apmEgValue = getAmpEgValue(bus);
  miGain.feed(apmEgValue, buffer.length);
  miDrive.feed(sp.ampDrive, buffer.length);
  miVolume.feed(sp.volume, buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    const gain = miGain.advance();
    const drive = miDrive.advance();
    const volume = miVolume.advance();
    let y = buffer[i] * gain;
    if (drive > 0) {
      y = tunableSigmoid(y * (1 + drive * 16), -drive * 0.95);
      y = applySoftClip(y);
    }
    buffer[i] = y * volume;
  }
}

export function createStateBus(): StateBus {
  return {
    parameters: defaultParameters,
    sampleRate: 0,
    gateOn: false,
    uptime: 0, //Relative time from note on
    noteOffUptime: 0, //Relative time from note off
    noteDurationSec: undefined,
    noteNumber: 24,
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

export class BassSynth {
  private bus: StateBus = createStateBus();

  prepare(sampleRate: number, maxFrames: number) {
    this.bus.sampleRate = sampleRate;
    if (!(this.bus.workBuffer && this.bus.workBuffer.length === maxFrames)) {
      this.bus.workBuffer = new Float32Array(maxFrames);
    }
  }

  applyPreset(presetKey: BassPresetKey) {
    Object.assign(this.bus.parameters, bassPresets[presetKey]);
  }

  processSamples(destBuffer: Float32Array) {
    if (this.bus.sampleRate === 0 || !this.bus.workBuffer) return;
    const buffer = this.bus.workBuffer;
    buffer.fill(0);
    const timeLength = buffer.length / this.bus.sampleRate;
    osc_processSamples(this.bus, buffer);
    voicingAmp_processSamples(this.bus, buffer);
    writeBuffer(destBuffer, buffer);
    this.bus.uptime += timeLength;
    this.bus.noteOffUptime += timeLength;
    if (
      this.bus.gateOn &&
      this.bus.noteDurationSec !== undefined &&
      this.bus.uptime > this.bus.noteDurationSec
    ) {
      this.bus.gateOn = false;
      this.bus.noteOffUptime = 0;
    }
    this.bus.gateTriggered = false;
  }

  playTone(noteNumber: number, noteDurationSec?: number) {
    if (noteDurationSec !== undefined && noteDurationSec <= 1e-6) return;
    this.bus.noteNumber = noteNumber;
    this.bus.uptime = 0;
    this.bus.noteOffUptime = 0;
    this.bus.gateOn = true;
    this.bus.noteDurationSec = noteDurationSec;
    this.bus.gateTriggered = true;
  }

  stopTone() {
    this.bus.gateOn = false;
    this.bus.noteOffUptime = 0;
  }
}
