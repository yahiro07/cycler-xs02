import { MoId, MoType, MotionParams } from "@dsp/base/parameter-defs";
import { Bus } from "@dsp/base/synthesis-bus";
import { mixMotionPartValues } from "@dsp/motions/funcs/motion-mux";
import { mapParamOscPitchToRelativeNote } from "@dsp/motions/funcs/pitch-mapping";
import { MotionPartValues } from "@dsp/motions/impl/motion-common";
import { processMotionWrapper } from "@dsp/motions/impl/motion-wrapper";
import { mapUnaryBipolar, power2 } from "@dsp/utils/number-utils";

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

export function getOscPitchRelNote(bus: Bus, stepPos: number) {
  const { sp } = bus;
  const {
    rndMappedValue: baseRelNote,
    egLevel,
    envMod,
    egOnGain,
    lfoOut,
    lfoDepth,
    lfoOnGain,
  } = processMotionWrapper(bus, MoId.oscPitch, stepPos);
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
  const { sp } = bus;
  //Output of OSC pitch knob value
  const partValues = processMotionWrapper(bus, MoId.oscPitch, stepPos);
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
  const { sp } = bus;
  const partValues = processMotionWrapper(bus, MoId.oscColor, stepPos);
  return mapMotionPartValuesToTargetParameter(
    partValues,
    sp.oscColor,
    sp.moOscColor,
  );
}

export function getFilterPrCutoff(bus: Bus, stepPos: number) {
  const { sp } = bus;
  const partValues = processMotionWrapper(bus, MoId.filterCutoff, stepPos);
  return mapMotionPartValuesToTargetParameter(
    partValues,
    sp.filterCutoff,
    sp.moFilterCutoff,
  );
}

export function getShaperLevelValue(bus: Bus, stepPos: number) {
  const { sp } = bus;
  const partValues = processMotionWrapper(bus, MoId.shaperLevel, stepPos);
  return mapMotionPartValuesToTargetParameter(
    partValues,
    sp.shaperLevel,
    sp.moShaperLevel,
  );
}

export function getPhaserLevelValue(bus: Bus, stepPos: number) {
  const { sp } = bus;
  const partValues = processMotionWrapper(bus, MoId.phaserLevel, stepPos);
  return mapMotionPartValuesToTargetParameter(
    partValues,
    sp.phaserLevel,
    sp.moPhaserLevel,
  );
}

export function getDelayTimeValue(bus: Bus, stepPos: number) {
  const { sp } = bus;
  const partValues = processMotionWrapper(bus, MoId.delayTime, stepPos);
  return mapMotionPartValuesToTargetParameter(
    partValues,
    sp.delayTime,
    sp.moDelayTime,
  );
}
