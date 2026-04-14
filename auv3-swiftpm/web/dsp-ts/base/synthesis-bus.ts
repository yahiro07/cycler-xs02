import {
  createSynthParametersSuit,
  SynthParametersSuit,
} from "@dsp/base/parameter-defs";

export type SynthesisIntermediateState = {
  pmxOscRelNote: number;
  pmxOscPrPitch: number;
  pmxOscColor: number;
  pmxFilterPrCutoff: number;
  pmxShaperLevel: number;
  pmxDelayTime: number;
  pmxPhaserLevel: number;
  //
  ampGain: number;
};

export type ModuleLocalStates = {
  gaterExSeq: unknown;
  gaterMainLax: unknown;
};

export type SynthesisBus = {
  parameters: SynthParametersSuit;
  interm: SynthesisIntermediateState;
  moduleLocals: ModuleLocalStates;
  sampleRate: number;
  maxFrames: number;
  noteNumber: number;
  gateOn: boolean;
  gateTriggered: boolean;
  // Fractional, total steps since the start of playback, not reset at loop boundaries
  totalStep: number;
  // Fractional, reset at loop boundary, 0–64 (up to 4 bars)
  currentStep: number;
  loopSeed: number;
  blockLength: number;
  gateStepAdvanced: boolean;
  bpm: number;
  loopBars: number;
  beatActive: boolean;
  paramVer: number;
  randomizationRequestFlag: boolean; //atomic in c++
};

export type Bus = SynthesisBus;

export function createSynthesisBus(): SynthesisBus {
  return {
    parameters: createSynthParametersSuit(),
    interm: {
      pmxOscRelNote: 0,
      pmxOscPrPitch: 0,
      pmxOscColor: 0,
      pmxFilterPrCutoff: 0,
      pmxShaperLevel: 0,
      pmxDelayTime: 0,
      pmxPhaserLevel: 0,
      ampGain: 0,
    },
    moduleLocals: {
      gaterExSeq: undefined,
      gaterMainLax: undefined,
    },
    sampleRate: 0,
    maxFrames: 0,
    noteNumber: 60,
    gateOn: false,
    gateTriggered: false,
    totalStep: 0,
    currentStep: 0,
    loopSeed: 0,
    blockLength: 0,
    gateStepAdvanced: false,
    bpm: 130,
    loopBars: 2,
    beatActive: false,
    paramVer: 0,
    randomizationRequestFlag: false,
  };
}
