import { feColorDefs } from "@/components/synth/common/color-defs";
import { knobRingConfigs } from "@/components/synth/common/ui-sizes";
import { FeKnobRing } from "../parts/FeKnobRing";

type Props = {
  arcRange: [number, number];
};

export const FeMotionKnobRing = ({ arcRange }: Props) => {
  const { ringThickness, radius } = knobRingConfigs;
  return (
    <FeKnobRing
      radius={radius}
      lineWidth={ringThickness}
      color={feColorDefs.knobIndicator}
      arcRange={arcRange}
      tickHalfAngle={140}
    />
  );
};
