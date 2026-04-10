import { power3 } from "@core/ax/number-utils";
import { shaperCore } from "@core/ax-audio/effects/shaper";
import { ShaperMode } from "@core/base/parameter-defs";

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
