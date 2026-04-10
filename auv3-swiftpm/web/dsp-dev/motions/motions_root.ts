import { calcNumStepsForSamples } from "@core/ax-audio/basic/sequence_helper";
import { GateStride } from "@core/base/parameter_defs";
import { Bus } from "@core/base/synthesis_bus";
import {
  getAmpEgLevel,
  wrapGetStepRamp,
} from "@core/motions/impl/motion_curve_mapper";
import * as mo_mappers from "@core/motions/mo_mappers";

function _getStepDeltaForFrame(bus: Bus) {
  return calcNumStepsForSamples(bus.bpm, bus.sampleRate, bus.blockLength);
}

function updateGate(bus: Bus) {
  const stepDelta = _getStepDeltaForFrame(bus);
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
  const stepDelta = _getStepDeltaForFrame(bus);
  bus.totalStep += stepDelta;
  bus.currentStep += stepDelta;
  const maxSteps = sp.loopBars * 16;
  if (bus.currentStep >= maxSteps) {
    bus.currentStep %= maxSteps;
    if (!sp.looped) {
      bus.loopSeed = Math.random();
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
