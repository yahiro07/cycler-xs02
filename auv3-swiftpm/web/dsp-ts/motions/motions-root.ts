import { GateStride } from "@dsp/base/parameter-defs";
import { Bus } from "@dsp/base/synthesis-bus";
import { calcNumStepsForSamples } from "@dsp/dsp-modules/basic/sequence-helper";
import { wrapGetStepRamp } from "@dsp/motions/gaters/ramp-provider";
import { getAmpEgLevel } from "@dsp/motions/impl/motion-curve-mapper";
import { moMappers_updateMoValues } from "@dsp/motions/mo-mappers";
import { m_random } from "@dsp/utils/math-utils";

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

export function motionsRoot_reset(bus: Bus) {
  bus.currentStep = 0;
  bus.totalStep = 0;
  bus.loopSeed = m_random();
}

export function motionsRoot_advance(bus: Bus) {
  updateGate(bus);
  updateAmp(bus);
  moMappers_updateMoValues(bus);
}

export function motionsRoot_processOnFrameEnd(bus: Bus) {
  const sp = bus.parameters;
  const stepDelta = getStepDeltaForFrame(bus);
  bus.totalStep += stepDelta;
  bus.currentStep += stepDelta;
  const maxSteps = bus.loopBars * 16;
  if (bus.currentStep >= maxSteps) {
    bus.currentStep %= maxSteps;
    if (!sp.looped) {
      bus.loopSeed = m_random();
    }
    if (sp.autoRandomizeOnLoop) {
      bus.randomizationRequestFlag = true;
    }
  }
}
