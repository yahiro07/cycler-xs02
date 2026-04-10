import {
  highClipOne,
  linearInterpolate,
  lowClipZero,
  mapUnaryBipolar,
} from "@core/ax/number_utils";

export function mixMotionPartValues(attrs: {
  //0~1
  egLevel: number;
  envMod: number;
  lfoOut: number;
  lfoDepth: number;
  rndOut: number;
  rndRange: number;
  //0~1
  knobValue: number;
  muxScaling: number;
}) {
  let {
    egLevel,
    envMod,
    lfoOut,
    lfoDepth,
    rndOut,
    rndRange,
    knobValue,
    muxScaling,
  } = attrs;
  egLevel = mapUnaryBipolar(egLevel);
  lfoOut = mapUnaryBipolar(lfoOut);
  rndOut = mapUnaryBipolar(rndOut);
  //片側の変動量を固定して調整
  //muxScalingを手動で調整する想定
  const egm = egLevel * envMod;
  const rdm = rndOut * rndRange;
  const lfm = lfoOut * lfoDepth;
  const amtTotal = envMod + lfoDepth + rndRange;
  const muxed = (rdm + lfm + egm) / (amtTotal === 0 ? 1 : amtTotal); //-1~1
  const g = amtTotal > 1 ? 1 : amtTotal;

  const halfRange = 0.5 * muxScaling * g;
  const hi = highClipOne(knobValue + halfRange);
  const lo = lowClipZero(knobValue - halfRange);
  return linearInterpolate(muxed, -1, 1, lo, hi, true);
}
