import {
  GateStride,
  MoRndMode,
  MoType,
  MotionParams,
  MotionStride,
} from "@dsp/base/parameter-defs";
import { RampSpec } from "@dsp/base/ramp-types";
import { SynthesisBus } from "@dsp/base/synthesis-bus";
import { glideCurves } from "@dsp/dsp-modules/basic/curves";
import { deterministicRandom } from "@dsp/dsp-modules/basic/deterministic-random";
import * as eg_curves from "@dsp/motions/funcs/eg-curves";
import * as lfo_waves from "@dsp/motions/funcs/lfo-waves";
import * as steps_common from "@dsp/motions/funcs/steps-common";
import * as ramp_provider from "@dsp/motions/gaters/ramp-provider";
import { RandomValueMapperFn } from "@dsp/motions/impl/motion-common";
import { invPower2Weak, lowClipZero, mixValue } from "@dsp/utils/number-utils";

const moPartSeed = {
  rnd: 1,
  lfo: 2,
  eg: 3,
  rndCover: 4,
};

export function wrapGetStepRamp(
  bus: SynthesisBus,
  stride: GateStride,
  stepPos: number,
): RampSpec {
  return ramp_provider.getPlainRamp(bus, lowClipZero(stepPos), stride);
}
export function wrapGetMoStepRamp(
  bus: SynthesisBus,
  stride: MotionStride,
  stepPos: number,
): RampSpec {
  return ramp_provider.getMotionRamp(bus, lowClipZero(stepPos), stride);
}

function rndCoverCurved(cover: number): number {
  return invPower2Weak(cover, 0.7);
  // return tunableSigmoid(cover, -0.4);
}

function getRandomWithCover(
  bus: SynthesisBus,
  moIdSeed: number,
  rampHeadPos: number,
  rndCover: number,
): number {
  const rrA = deterministicRandom(
    bus.loopSeed + rampHeadPos + moIdSeed + moPartSeed.rndCover,
  );
  if (rrA > rndCoverCurved(rndCover)) {
    return 0.5;
  }
  return deterministicRandom(
    bus.loopSeed + rampHeadPos + moIdSeed + moPartSeed.rnd,
  );
}

function getMappedValueWithRandom(
  bus: SynthesisBus,
  moIdSeed: number,
  rampHeadPos: number,
  rndCover: number,
  mapperFn: RandomValueMapperFn,
): number {
  const rrA = deterministicRandom(
    bus.loopSeed + rampHeadPos + moIdSeed + moPartSeed.rndCover,
  );
  if (rrA > rndCoverCurved(rndCover)) {
    return mapperFn("rndSkip");
  }
  const rr = deterministicRandom(
    bus.loopSeed + rampHeadPos + moIdSeed + moPartSeed.rnd,
  );
  return mapperFn(rr);
}

function wrapGlide(pos: number): number {
  return glideCurves.glide3(pos, 0.5);
}

export function getRndMapped(
  bus: SynthesisBus,
  mp: MotionParams,
  moIdSeed: number,
  stepPos: number,
  mapperFn: RandomValueMapperFn,
): number {
  if (mp.moType === MoType.rnd) {
    const ramp = wrapGetMoStepRamp(bus, mp.rndStride, stepPos);
    const semiCurrent = getMappedValueWithRandom(
      bus,
      moIdSeed,
      ramp.headPos,
      mp.rndCover,
      mapperFn,
    );
    const isSdMode = mp.rndMode === MoRndMode.sd;
    const applyGlide = mp.rndMode === MoRndMode.sg;
    if (applyGlide || isSdMode) {
      const semiNext = getMappedValueWithRandom(
        bus,
        moIdSeed,
        ramp.headPos + ramp.duration,
        mp.rndCover,
        mapperFn,
      );
      const m = applyGlide ? wrapGlide(ramp.progress) : ramp.progress;
      return mixValue(semiCurrent, semiNext, m);
    }
    return semiCurrent;
  }
  return mapperFn("rndOff");
}
export function getRndMod(
  bus: SynthesisBus,
  mp: MotionParams,
  moIdSeed: number,
  stepPos: number,
): number {
  if (mp.moType === MoType.rnd) {
    const ramp = wrapGetMoStepRamp(bus, mp.rndStride, stepPos);
    const rrCurrent = getRandomWithCover(
      bus,
      moIdSeed,
      ramp.headPos,
      mp.rndCover,
    );
    const isSdMode = mp.rndMode === MoRndMode.sd;
    const applyGlide = mp.rndMode === MoRndMode.sg;
    if (applyGlide || isSdMode) {
      const rrNext = getRandomWithCover(
        bus,
        moIdSeed,
        ramp.headPos + ramp.duration,
        mp.rndCover,
      );
      const m = applyGlide ? wrapGlide(ramp.progress) : ramp.progress;
      return mixValue(rrCurrent, rrNext, m);
    }
    return rrCurrent;
  }
  return 0;
}
export function getLfoOut(mp: MotionParams, stepPos: number): number {
  if (mp.moType === MoType.lfo) {
    const sd = steps_common.getLfoStepPeriod(mp.lfoRate, mp.lfoRateStepped);
    const ramp = ramp_provider.getMasterDividedRamp(stepPos, sd, false);
    const phase = ramp.progress;
    return lfo_waves.getLfoWave(mp.lfoWave, phase);
  }
  return 0;
}

export function getMoEgLevel(
  bus: SynthesisBus,
  mp: MotionParams,
  stepPos: number,
): number {
  const ramp = wrapGetMoStepRamp(bus, mp.egStride, stepPos);
  if (0) {
    //pulsed
    return eg_curves.getEgCurve(mp.egWave, ramp.relPos, mp.egCurve);
  } else {
    return eg_curves.getEgCurve(mp.egWave, ramp.progress, mp.egCurve);
  }
}

export function getAmpEgLevel(bus: SynthesisBus, stepPos: number): number {
  const ramp = wrapGetStepRamp(bus, GateStride.gate, stepPos);
  return eg_curves.getAmpEgCurvePL(
    ramp.relPos,
    bus.sp.ampEgHold,
    bus.sp.ampEgDecay,
    ramp.duration,
  );
}
