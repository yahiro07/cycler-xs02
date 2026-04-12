import { MoId, MoType, MotionParams } from "@dsp/base/parameter-defs";
import { Bus } from "@dsp/base/synthesis-bus";
import { mixMotionPartValues } from "@dsp/motions/funcs/motion-mux";
import { mapParamOscPitchToRelativeNote } from "@dsp/motions/funcs/pitch-mapping";
import {
  MotionPartValues,
  RandomValueSpecial,
} from "@dsp/motions/impl/motion-common";
import { processMotionWrapper } from "@dsp/motions/impl/motion-wrapper";
import {
  clampValueZeroOne,
  mapUnaryBipolar,
  power2,
} from "@dsp/utils/number-utils";

function mapMotionPartValuesToTargetParameter(
  partValues: MotionPartValues,
  knobValue: number,
  mp: MotionParams,
) {
  if (!mp.moOn) return knobValue;
  let {
    egOnGain,
    egLevel,
    envMod,
    rndOnGain,
    rndOut,
    rndRange,
    lfoOnGain,
    lfoOut,
    lfoDepth,
  } = partValues;

  envMod *= egOnGain;
  lfoDepth *= lfoOnGain;
  rndRange *= rndOnGain;

  return mixMotionPartValues({
    egLevel,
    envMod,
    lfoOut,
    lfoDepth,
    rndOut,
    rndRange,
    knobValue,
    muxScaling: 1,
  });
}

function randomValueMapperFn_oscPitchRelNote(
  bus: Bus,
  rr: number | RandomValueSpecial,
) {
  const sp = bus.parameters;
  //pitch, smooth mapping on, 相対ノート値で出力
  //SD/SGの出力ではrandom mappingした結果の相対ノート値の間で線形補間
  //rndのfallbackでノブの値によらずノブ中央(0.5, ノート基準音)の値を返す
  let prPitch: number;
  if (rr === RandomValueSpecial.rndSkip) {
    prPitch = 0.5;
  } else if (rr === RandomValueSpecial.rndOff) {
    prPitch = sp.oscPitch;
  } else {
    prPitch = clampValueZeroOne(
      sp.oscPitch + mapUnaryBipolar(rr) * sp.moOscPitch.moAmount * 0.5,
    );
  }
  return mapParamOscPitchToRelativeNote(prPitch, sp.oscPitchMode);
}

function randomValueMapperFn_oscPrPitch(
  bus: Bus,
  rr: number | RandomValueSpecial,
) {
  const sp = bus.parameters;
  let prPitch: number;
  if (rr === RandomValueSpecial.rndSkip) {
    prPitch = 0.5;
  } else if (rr === RandomValueSpecial.rndOff) {
    prPitch = sp.oscPitch;
  } else {
    prPitch = clampValueZeroOne(
      sp.oscPitch + mapUnaryBipolar(rr) * sp.moOscPitch.moAmount * 0.5,
    );
  }
  return prPitch;
}

export function getOscPitchRelNote(bus: Bus, stepPos: number) {
  const sp = bus.parameters;
  const {
    rndMappedValue: baseRelNote,
    egLevel,
    envMod,
    egOnGain,
    lfoOut,
    lfoDepth,
    lfoOnGain,
  } = processMotionWrapper(
    bus,
    MoId.oscPitch,
    stepPos,
    randomValueMapperFn_oscPitchRelNote,
  );
  if (!sp.moOscPitch.moOn) {
    return mapParamOscPitchToRelativeNote(sp.oscPitch, sp.oscPitchMode);
  }
  //Relative note output for OSC pitch
  //LFO/EG adds relative note values as modulation within a one-octave range
  const egm = egOnGain * mapUnaryBipolar(envMod) * power2(egLevel) * 12;
  const lfm = lfoOnGain * mapUnaryBipolar(lfoOut) * power2(lfoDepth) * 12;
  return baseRelNote + egm + lfm;
}

export function getOscPrPitch(bus: Bus, stepPos: number) {
  const sp = bus.parameters;
  //Output of OSC pitch knob value
  const partValues = processMotionWrapper(
    bus,
    MoId.oscPitch,
    stepPos,
    randomValueMapperFn_oscPrPitch,
  );
  const { moOn, moType } = sp.moOscPitch;
  // When using rnd, return the value mapped by rnd using the knob center fallback
  if (moOn && moType === MoType.rnd) {
    return partValues.rndMappedValue;
  }
  //lfo/eg is handled in the same way as other knob automations
  return mapMotionPartValuesToTargetParameter(
    partValues,
    sp.oscPitch,
    sp.moOscPitch,
  );
}

export function getOscColorValue(bus: Bus, stepPos: number) {
  const sp = bus.parameters;
  const partValues = processMotionWrapper(bus, MoId.oscColor, stepPos);
  return mapMotionPartValuesToTargetParameter(
    partValues,
    sp.oscColor,
    sp.moOscColor,
  );
}

export function getFilterPrCutoff(bus: Bus, stepPos: number) {
  const sp = bus.parameters;
  const partValues = processMotionWrapper(bus, MoId.filterCutoff, stepPos);
  return mapMotionPartValuesToTargetParameter(
    partValues,
    sp.filterCutoff,
    sp.moFilterCutoff,
  );
}

export function getShaperLevelValue(bus: Bus, stepPos: number) {
  const sp = bus.parameters;
  const partValues = processMotionWrapper(bus, MoId.shaperLevel, stepPos);
  return mapMotionPartValuesToTargetParameter(
    partValues,
    sp.shaperLevel,
    sp.moShaperLevel,
  );
}

export function getPhaserLevelValue(bus: Bus, stepPos: number) {
  const sp = bus.parameters;
  const partValues = processMotionWrapper(bus, MoId.phaserLevel, stepPos);
  return mapMotionPartValuesToTargetParameter(
    partValues,
    sp.phaserLevel,
    sp.moPhaserLevel,
  );
}

export function getDelayTimeValue(bus: Bus, stepPos: number) {
  const sp = bus.parameters;
  const partValues = processMotionWrapper(bus, MoId.delayTime, stepPos);
  return mapMotionPartValuesToTargetParameter(
    partValues,
    sp.delayTime,
    sp.moDelayTime,
  );
}
