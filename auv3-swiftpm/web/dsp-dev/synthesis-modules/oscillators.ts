import { OscPitchMode, OscUnisonMode } from "@core/base/parameter-defs";
import { Bus } from "@core/base/synthesis-bus";
import { midiToFrequency } from "@core/dsp-modules/basic/synthesis-helper";
import {
  createOversamplingStage,
  OversamplingStage,
} from "@core/dsp-modules/filters/oversampling-stage";
import {
  mapParamOscPitchToOctXCrossMixRateKey,
  mapParamOscPitchToRelativeNote,
} from "@core/motions/funcs/pitch-mapping";
import { OscillatorCore } from "@core/synthesis-modules/oscillator-core";
import { seqNumbers } from "@core/utils/arrays";
import { power3 } from "@core/utils/number-utils";

type VoiceSpec = { octaveRatio: number; detune: number; gain: number };
const ovsRate = 4;
export class Oscillators {
  bus: Bus;
  oscs: OscillatorCore[];
  ovsStage: OversamplingStage;
  voiceSpecs: VoiceSpec[];
  voiceIndex: number;

  constructor(bus: Bus) {
    this.bus = bus;
    this.oscs = seqNumbers(6).map(() => new OscillatorCore(bus));
    this.ovsStage = createOversamplingStage(ovsRate);
    this.voiceSpecs = seqNumbers(6).map(() => ({
      octaveRatio: 0,
      detune: 0,
      gain: 0,
    }));
    this.voiceIndex = 0;
  }

  reset() {
    this.oscs.forEach((osc) => {
      osc.reset();
    });
  }

  prepare() {
    this.ovsStage.ensureAllocated(this.bus.maxFrames);
  }

  _calcNormFreq() {
    const { bus } = this;
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

  _resetVoiceAssigns() {
    this.voiceIndex = 0;
  }

  _addVoice(octaveRatio: number, detune: number, gain: number) {
    const { voiceSpecs } = this;
    const vo = voiceSpecs[this.voiceIndex];
    vo.octaveRatio = octaveRatio;
    vo.detune = detune;
    vo.gain = gain;
    if (this.voiceIndex < 5) {
      this.voiceIndex++;
    }
  }

  _assignVoices() {
    const { bus, voiceSpecs } = this;
    const { sp, interm } = bus;
    const { oscUnisonMode: pileMode } = sp;
    const det = power3(sp.oscUnisonDetune) * 0.03;

    const crossMixRateKey =
      sp.oscPitchMode === OscPitchMode.oct_x
        ? mapParamOscPitchToOctXCrossMixRateKey(interm.pmxOscPrPitch)
        : -1;

    this._resetVoiceAssigns();

    //unison detuneの対応
    if (pileMode === OscUnisonMode.one) {
      this._addVoice(1, 0, 1);
    } else if (pileMode === OscUnisonMode.det2) {
      this._addVoice(1, -det, 0.5);
      this._addVoice(1, det, 0.5);
    } else if (pileMode === OscUnisonMode.det3) {
      this._addVoice(1, -det, 0.1);
      this._addVoice(1, 0, 0.8);
      this._addVoice(1, det, 0.1);
    } else if (pileMode === OscUnisonMode.sub) {
      this._addVoice(1, -det, 0.5);
      this._addVoice(0.5, det, 0.5);
    } else if (pileMode === OscUnisonMode.fifth) {
      this._addVoice(1, -det, 0.5);
      this._addVoice(1.5, det, 0.5);
    }

    if (crossMixRateKey !== -1) {
      //pitch mode octave cross mixの対応
      const isOdd = (crossMixRateKey >>> 0) & 1;
      const upperMix = crossMixRateKey % 1;
      const wa = Math.sqrt(1 - upperMix);
      const wb = Math.sqrt(upperMix);
      const numVoices = this.voiceIndex;
      for (let i = 0; i < numVoices; i++) {
        const vo = voiceSpecs[i];
        this._addVoice(vo.octaveRatio, vo.detune, vo.gain);
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

  _processSamplesInternal(buffer: Float32Array, normFreq: number) {
    const { oscs, voiceIndex, voiceSpecs } = this;
    for (let i = 0; i < voiceIndex; i++) {
      const vo = voiceSpecs[i];
      oscs[i].processSamples(
        buffer,
        normFreq * vo.octaveRatio * (1 + vo.detune),
        vo.gain,
      );
    }
  }

  processSamples(buffer: Float32Array) {
    const { bus, ovsStage } = this;
    const { sp } = bus;
    if (!sp.oscOn) return;

    this._assignVoices();

    const normFreq = this._calcNormFreq();

    const highResBuffer = ovsStage.readIn(buffer);
    if (!highResBuffer) return;
    this._processSamplesInternal(highResBuffer, normFreq);
    ovsStage.writeOut();
  }
}
