import { KnobFrame } from "@/components/general/KnobFrame";
import { useKnobModel } from "@/components/synth/common/use-knob-model";
import { FeGaugeView } from "@/components/synth/parts/FeGaugeView";

type Props = {
  value: number;
  onChange: (value: number) => void;
  active?: boolean;
  onTap?: () => void;
  onStartEdit?: () => void;
  onEndEdit?: () => void;
};
export const FeSliderGauge = ({
  value,
  onChange,
  active,
  onTap,
  onStartEdit,
  onEndEdit,
}: Props) => {
  const { normValue, handlePointerDown } = useKnobModel({
    value,
    onChange,
    onTap,
    onStartEdit,
    onEndEdit,
  });
  return (
    <KnobFrame onPointerDown={handlePointerDown}>
      <FeGaugeView value={normValue} active={active} />
    </KnobFrame>
  );
};
