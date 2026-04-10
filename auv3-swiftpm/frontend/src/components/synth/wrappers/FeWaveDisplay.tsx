import { uiSizes } from "@/components/synth/common/ui-sizes";
import { useUnitWaveScopeWavePath } from "@/components/synth/common/use-unit-wave-scope-wave-path";
import { FeWaveformView } from "@/components/synth/parts/FeWaveformView";

type Props = {
  waveFn: (x: number, shape: number) => number;
  shape?: number;
  invertY?: boolean;
  nx?: number;
  baseSize?: number;
};
export const FeWaveDisplay = ({
  waveFn,
  shape = 0,
  invertY = false,
  baseSize = uiSizes.waveDisplay,
}: Props) => {
  const pathD = useUnitWaveScopeWavePath({
    waveFn,
    shape,
    baseSize,
    nx: 1,
    ny: 1,
    invertY,
  });
  return <FeWaveformView path={pathD} baseSize={baseSize} />;
};
