import { MoRndMode } from "@/base/parameters";
import { glideCurves } from "@/logic/curves";
import { mixValue } from "@/logic/number-helper";

const valuesSequence = [0.5, 0.8, 0.2, 0.6, 0.3, 0.5];

function rndWavePreviewFnImpl(x: number, mode: "sh" | "sd" | "sg") {
  const pos = x * 4;
  const idx0 = Math.floor(pos);
  const idx1 = (idx0 + 1) % valuesSequence.length;
  const v0 = valuesSequence[idx0];
  const v1 = valuesSequence[idx1];
  const m = pos - idx0;
  if (mode === "sh") {
    return v0;
  } else if (mode === "sd") {
    return mixValue(v0, v1, m);
  } else if (mode === "sg") {
    return mixValue(v0, v1, glideCurves.glide3(m, 0.5));
  }
  return 0;
}

export const rndWavePreviewFn = {
  [MoRndMode.sh]: (x) => rndWavePreviewFnImpl(x, "sh"),
  [MoRndMode.sd]: (x) => rndWavePreviewFnImpl(x, "sd"),
  [MoRndMode.sg]: (x) => rndWavePreviewFnImpl(x, "sg"),
} satisfies Record<MoRndMode, (x: number) => number>;
