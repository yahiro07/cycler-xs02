import {
  GaterType,
  GateStride,
  MotionStride,
  PureStride,
} from "@core/base/parameter-defs";
import { RampSpec, StepRampCode } from "@core/base/ramp-types";
import { Bus } from "@core/base/synthesis-bus";
import { getStepPeriod } from "@core/motions/funcs/steps-common";
import { gaterExSeqMode_getRampSpec } from "@core/motions/gaters/gater-ex-seq";
import { gaterMinLaxMode_getRampCodeCached } from "@core/motions/gaters/gater-main-lax";
import { gaterMainSeqMode_getRampCode } from "@core/motions/gaters/gater-main-seq";
import { m_floor } from "@core/utils/math-utils";
import { fracPart } from "@core/utils/number-utils";

export function getGaterStepRamp(
  stepPos: number,
  gaterPeriod: PureStride,
  rampCode: StepRampCode,
): RampSpec {
  const stepPeriod = getStepPeriod(gaterPeriod);
  const scaledStep = stepPos / stepPeriod;
  let headPos = m_floor(scaledStep) * stepPeriod;
  let progress = fracPart(scaledStep);
  let duration = stepPeriod;
  if (rampCode === StepRampCode.tie1) {
    progress *= 0.5;
    duration *= 2;
  } else if (rampCode === StepRampCode.tie2) {
    headPos -= stepPeriod;
    progress = 0.5 + progress * 0.5;
    duration *= 2;
  }
  return {
    headPos,
    relPos: progress * duration,
    progress,
    duration,
  };
}
export function getMasterDividedRamp(
  stepPos: number,
  stepPeriod: number,
  oneShot = false,
): RampSpec {
  const scaledStep = stepPos / stepPeriod;
  if (oneShot) {
    const progress = stepPos < stepPeriod ? fracPart(scaledStep) : 1;
    return {
      headPos: 0,
      relPos: stepPos,
      progress,
      duration: stepPeriod,
    };
  } else {
    const progress = fracPart(scaledStep);
    return {
      headPos: m_floor(scaledStep) * stepPeriod,
      relPos: progress * stepPeriod,
      progress,
      duration: stepPeriod,
    };
  }
}
export function getPlainRamp(
  bus: Bus,
  stepPos: number,
  inputStride: GateStride,
): RampSpec {
  const gp = bus.sp;
  if (inputStride === GateStride.gate) {
    const rampCode =
      gp.gaterType === GaterType.lax
        ? gaterMinLaxMode_getRampCodeCached(bus, stepPos)
        : gaterMainSeqMode_getRampCode(bus, stepPos);

    const gaterStride = gp.gaterStride as unknown as PureStride;
    return getGaterStepRamp(stepPos, gaterStride, rampCode);
  } else {
    const stride = inputStride as unknown as PureStride;
    const stepPeriod = getStepPeriod(stride);
    return getMasterDividedRamp(stepPos, stepPeriod, false);
  }
}
export function getMotionRamp(
  bus: Bus,
  stepPos: number,
  inputStride: MotionStride,
): RampSpec {
  if (inputStride === MotionStride.ex) {
    return gaterExSeqMode_getRampSpec(bus, stepPos);
  }
  const stride = inputStride as unknown as GateStride;
  return getPlainRamp(bus, stepPos, stride);
}
