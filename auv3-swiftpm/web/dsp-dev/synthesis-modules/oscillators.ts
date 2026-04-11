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

  calcNormFreq() {
    const { bus } = this;
    const { sp, interm } = bus;

    let noteNumber = 0;
    if (sp.oscPitchMoSmooth) {
      //Smoothly map the MO's continuous values to the intermediate notes between notes
      noteNumber = bus.noteNumber + interm.pmxOscRelNote + sp.oscOctave * 12;
    } else {
      //Map parameter changes directly to note values
      noteNumber =
        bus.noteNumber +
        mapParamOscPitchToRelativeNote(interm.pmxOscPrPitch, sp.oscPitchMode) +
        sp.oscOctave * 12;
    }
    const oscSampleRate = bus.sampleRate * ovsRate;
    return midiToFrequency(noteNumber) / oscSampleRate;
  }

  resetVoiceAssigns() {
    this.voiceIndex = 0;
  }

  addVoice(octaveRatio: number, detune: number, gain: number) {
    const { voiceSpecs } = this;
    const vo = voiceSpecs[this.voiceIndex];
    vo.octaveRatio = octaveRatio;
    vo.detune = detune;
    vo.gain = gain;
    if (this.voiceIndex < 5) {
      this.voiceIndex++;
    }
  }

  assignVoices() {
    const { bus, voiceSpecs } = this;
    const { sp, interm } = bus;
    const { oscUnisonMode: pileMode } = sp;
    const det = power3(sp.oscUnisonDetune) * 0.03;

    const crossMixRateKey =
      sp.oscPitchMode === OscPitchMode.oct_x
        ? mapParamOscPitchToOctXCrossMixRateKey(interm.pmxOscPrPitch)
        : -1;

    this.resetVoiceAssigns();

    //Support for unison detune
    if (pileMode === OscUnisonMode.one) {
      this.addVoice(1, 0, 1);
    } else if (pileMode === OscUnisonMode.det2) {
      this.addVoice(1, -det, 0.5);
      this.addVoice(1, det, 0.5);
    } else if (pileMode === OscUnisonMode.det3) {
      this.addVoice(1, -det, 0.1);
      this.addVoice(1, 0, 0.8);
      this.addVoice(1, det, 0.1);
    } else if (pileMode === OscUnisonMode.sub) {
      this.addVoice(1, -det, 0.5);
      this.addVoice(0.5, det, 0.5);
    } else if (pileMode === OscUnisonMode.fifth) {
      this.addVoice(1, -det, 0.5);
      this.addVoice(1.5, det, 0.5);
    }

    if (crossMixRateKey !== -1) {
      //Support for pitch mode octave cross mix
      const isOdd = (crossMixRateKey >>> 0) & 1;
      const upperMix = crossMixRateKey % 1;
      const wa = Math.sqrt(1 - upperMix);
      const wb = Math.sqrt(upperMix);
      const numVoices = this.voiceIndex;
      for (let i = 0; i < numVoices; i++) {
        const vo = voiceSpecs[i];
        this.addVoice(vo.octaveRatio, vo.detune, vo.gain);
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

  processSamplesInternal(buffer: Float32Array, normFreq: number) {
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

    this.assignVoices();

    const normFreq = this.calcNormFreq();

    const highResBuffer = ovsStage.readIn(buffer);
    if (!highResBuffer) return;
    this.processSamplesInternal(highResBuffer, normFreq);
    ovsStage.writeOut();
  }
}
