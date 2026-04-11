import { GateStride } from "@core/base/parameter-defs";
import { Bus } from "@core/base/synthesis-bus";
import { calcNumStepsForSamples } from "@core/dsp-modules/basic/sequence-helper";
import {
  getAmpEgLevel,
  wrapGetStepRamp,
} from "@core/motions/impl/motion-curve-mapper";
import * as mo_mappers from "@core/motions/mo-mappers";

function getStepDeltaForFrame(bus: Bus) {
  return calcNumStepsForSamples(bus.bpm, bus.sampleRate, bus.blockLength);
}

function updateGate(bus: Bus) {
  const stepDelta = getStepDeltaForFrame(bus);
  const prevStep = bus.currentStep - stepDelta;
  const prevRamp = wrapGetStepRamp(bus, GateStride.gate, prevStep);
  const currRamp = wrapGetStepRamp(bus, GateStride.gate, bus.currentStep);
  bus.gateStepAdvanced = currRamp.headPos !== prevRamp.headPos;
}

function updateAmp(bus: Bus) {
  bus.interm.ampGain = getAmpEgLevel(bus, bus.currentStep);
}

function updateMoValues(bus: Bus) {
  const { interm } = bus;
  const step = bus.currentStep;
  interm.pmxOscRelNote = mo_mappers.getOscPitchRelNote(bus, step);
  interm.pmxOscPrPitch = mo_mappers.getOscPrPitch(bus, step);
  interm.pmxOscColor = mo_mappers.getOscColorValue(bus, step);
  interm.pmxFilterPrCutoff = mo_mappers.getFilterPrCutoff(bus, step);
  interm.pmxShaperLevel = mo_mappers.getShaperLevelValue(bus, step);
  interm.pmxPhaserLevel = mo_mappers.getPhaserLevelValue(bus, step);
  interm.pmxDelayTime = mo_mappers.getDelayTimeValue(bus, step);
}

function updateLoopOnFrameEnd(bus: Bus) {
  const { sp } = bus;
  const stepDelta = getStepDeltaForFrame(bus);
  bus.totalStep += stepDelta;
  bus.currentStep += stepDelta;
  const maxSteps = sp.loopBars * 16;
  if (bus.currentStep >= maxSteps) {
    bus.currentStep %= maxSteps;
    if (!sp.looped) {
      bus.loopSeed = Math.random();
    }
    if (sp.autoRandomizeOnLoop) {
      bus.randomizationRequestFlag = true;
    }
  }
}

export function reset(bus: Bus) {
  bus.currentStep = 0;
  bus.totalStep = 0;
  bus.loopSeed = Math.random();
}

export function advance(bus: Bus) {
  updateGate(bus);
  updateAmp(bus);
  updateMoValues(bus);
}

export function processOnFrameEnd(bus: Bus) {
  updateLoopOnFrameEnd(bus);
}
