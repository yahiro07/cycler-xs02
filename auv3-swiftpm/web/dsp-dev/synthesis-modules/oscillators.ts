import { seqNumbers } from "@core/ax/arrays";
import { power3 } from "@core/ax/number-utils";
import { midiToFrequency } from "@core/ax-audio/basic/synthesis-helper";
import {
  createOversamplingStage,
  OversamplingStage,
} from "@core/ax-audio/filters/oversampling-stage";
import { OscPitchMode, OscUnisonMode } from "@core/base/parameter-defs";
import { Bus } from "@core/base/synthesis-bus";
import {
  mapParamOscPitchToOctXCrossMixRateKey,
  mapParamOscPitchToRelativeNote,
} from "@core/motions/funcs/pitch-mapping";
import {
  createOscillatorCore,
  OscillatorCore,
  oscillatorCore_processSamples,
  oscillatorCore_reset,
} from "@core/synthesis_modules/oscillator_core";

type VoiceSpec = { octaveRatio: number; detune: number; gain: number };

export type Oscillators = {
  bus: Bus;
  oscs: OscillatorCore[];
  ovsStage: OversamplingStage;
  voiceSpecs: VoiceSpec[];
  voiceIndex: number;
};

const ovsRate = 4;

export function createOscillators(bus: Bus): Oscillators {
  const oscs = seqNumbers(6).map(() => createOscillatorCore(bus));
  const ovsStage = createOversamplingStage(ovsRate);
  const voiceSpecs: VoiceSpec[] = seqNumbers(6).map(() => ({
    octaveRatio: 0,
    detune: 0,
    gain: 0,
  }));
  return {
    bus,
    oscs,
    ovsStage,
    voiceSpecs,
    voiceIndex: 0,
  };
}

export function oscillators_reset(self: Oscillators) {
  self.oscs.forEach((osc) => {
    oscillatorCore_reset(osc);
  });
}

export function oscillators_prepare(self: Oscillators) {
  self.ovsStage.ensureAllocated(self.bus.maxFrames);
}

function _calcNormFreq(self: Oscillators) {
  const { bus } = self;
  const { sp, interm } = bus;

  let noteNumber = 0;
  if (sp.oscPitchMoSmooth) {
    //MOの連続量をノート間の中間音としてスムーズにマッピング
    noteNumber = bus.noteNumber + interm.pmxOscRelNote + sp.oscOctave * 12;
  } else {
    //パラメタを変化をそのままノートの値にマッピング
    noteNumber =
      bus.noteNumber +
      mapParamOscPitchToRelativeNote(interm.pmxOscPrPitch, sp.oscPitchMode) +
      sp.oscOctave * 12;
  }
  const oscSampleRate = bus.sampleRate * ovsRate;
  return midiToFrequency(noteNumber) / oscSampleRate;
}

function _resetVoiceAssigns(self: Oscillators) {
  self.voiceIndex = 0;
}

function _addVoice(
  self: Oscillators,
  octaveRatio: number,
  detune: number,
  gain: number,
) {
  const { voiceSpecs } = self;
  const vo = voiceSpecs[self.voiceIndex];
  vo.octaveRatio = octaveRatio;
  vo.detune = detune;
  vo.gain = gain;
  if (self.voiceIndex < 5) {
    self.voiceIndex++;
  }
}

function _assignVoices(self: Oscillators) {
  const { bus, voiceSpecs } = self;
  const { sp, interm } = bus;
  const { oscUnisonMode: pileMode } = sp;
  const det = power3(sp.oscUnisonDetune) * 0.03;

  const crossMixRateKey =
    sp.oscPitchMode === OscPitchMode.oct_x
      ? mapParamOscPitchToOctXCrossMixRateKey(interm.pmxOscPrPitch)
      : -1;

  _resetVoiceAssigns(self);

  //unison detuneの対応
  if (pileMode === OscUnisonMode.one) {
    _addVoice(self, 1, 0, 1);
  } else if (pileMode === OscUnisonMode.det2) {
    _addVoice(self, 1, -det, 0.5);
    _addVoice(self, 1, det, 0.5);
  } else if (pileMode === OscUnisonMode.det3) {
    _addVoice(self, 1, -det, 0.1);
    _addVoice(self, 1, 0, 0.8);
    _addVoice(self, 1, det, 0.1);
  } else if (pileMode === OscUnisonMode.sub) {
    _addVoice(self, 1, -det, 0.5);
    _addVoice(self, 0.5, det, 0.5);
  } else if (pileMode === OscUnisonMode.fifth) {
    _addVoice(self, 1, -det, 0.5);
    _addVoice(self, 1.5, det, 0.5);
  }

  if (crossMixRateKey !== -1) {
    //pitch mode octave cross mixの対応
    const isOdd = (crossMixRateKey >>> 0) & 1;
    const upperMix = crossMixRateKey % 1;
    const wa = Math.sqrt(1 - upperMix);
    const wb = Math.sqrt(upperMix);
    const numVoices = self.voiceIndex;
    for (let i = 0; i < numVoices; i++) {
      const vo = voiceSpecs[i];
      _addVoice(self, vo.octaveRatio, vo.detune, vo.gain);
    }
    const formerVoices = voiceSpecs.slice(0, numVoices);
    const latterVoices = voiceSpecs.slice(numVoices);
    if (isOdd) {
      formerVoices.forEach((vo) => {
        vo.gain *= wa;
      });
      latterVoices.forEach((vo) => {
        vo.octaveRatio *= 2;
        vo.gain *= wb;
      });
    } else {
      formerVoices.forEach((vo) => {
        vo.octaveRatio *= 2;
        vo.gain *= wb;
      });
      latterVoices.forEach((vo) => {
        vo.gain *= wa;
      });
    }
  }
}

function _processSamplesInternal(
  self: Oscillators,
  buffer: Float32Array,
  normFreq: number,
) {
  const { oscs, voiceIndex, voiceSpecs } = self;
  for (let i = 0; i < voiceIndex; i++) {
    const vo = voiceSpecs[i];
    oscillatorCore_processSamples(
      oscs[i],
      buffer,
      normFreq * vo.octaveRatio * (1 + vo.detune),
      vo.gain,
    );
  }
}

export function oscillators_processSamples(
  self: Oscillators,
  buffer: Float32Array,
) {
  const { bus, ovsStage } = self;
  const { sp } = bus;
  if (!sp.oscOn) return;

  _assignVoices(self);

  const normFreq = _calcNormFreq(self);

  const highResBuffer = ovsStage.readIn(buffer);
  if (!highResBuffer) return;
  _processSamplesInternal(self, highResBuffer, normFreq);
  ovsStage.writeOut();
}
