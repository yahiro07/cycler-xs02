import { ShaperMode } from "@dsp/base/parameter-defs";
import { shaperCore } from "@dsp/dsp-modules/effects/shaper";
import { power3 } from "@dsp/utils/number-utils";

export function applyShaper(
  x: number,
  prLevel: number,
  shaperMode: ShaperMode,
) {
  prLevel = power3(prLevel) / 2;
  const sc = 1;
  if (shaperMode === ShaperMode.ws1) {
    const y = x * (1 + prLevel * 48 * sc);
    return shaperCore.foldSine(y);
  } else if (shaperMode === ShaperMode.ws2) {
    const y = x * (1 + prLevel * 16 * sc);
    return shaperCore.foldSawHalf(y);
  } else if (shaperMode === ShaperMode.ws3) {
    const y = x * (1 + prLevel * 16 * sc);
    return shaperCore.foldPolyHalf(y);
  } else if (shaperMode === ShaperMode.ws4) {
    const y = x * (1 + prLevel * 24 * sc);
    return shaperCore.foldBlend(y, prLevel);
  } else if (shaperMode === ShaperMode.ws5) {
    const y = x * (1 + prLevel * 24 * sc);
    return shaperCore.foldTriangle(y);
  }
  return x;
}
