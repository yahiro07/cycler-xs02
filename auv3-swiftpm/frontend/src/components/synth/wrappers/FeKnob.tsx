import { KnobFrame } from "@/components/general/KnobFrame";
import { UiScaler } from "@/components/general/UiScaler";
import { uiSizes } from "../common/ui-sizes";
import { TickDisplayStepsSpec, useKnobModel } from "../common/use-knob-model";
import { FeKnobView } from "../parts/FeKnobView";

const knobScales = {
  main: 1,
  small: uiSizes.knobSmall / uiSizes.knobMain,
  xs: uiSizes.knobXs / uiSizes.knobMain,
};

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  tickDisplaySteps?: TickDisplayStepsSpec;
  size?: "main" | "small" | "xs";
  altBkColor?: boolean;
  onStartEdit?: () => void;
  onEndEdit?: () => void;
};
export const FeKnob = ({
  label,
  value,
  onChange,
  tickDisplaySteps,
  size = "main",
  altBkColor = false,
  onStartEdit,
  onEndEdit,
}: Props) => {
  const { normValue, handlePointerDown } = useKnobModel({
    value,
    onChange,
    tickDisplaySteps,
    onStartEdit,
    onEndEdit,
  });
  if (size === "main") {
    return (
      <KnobFrame onPointerDown={handlePointerDown}>
        <FeKnobView label={label} value={normValue} altBkColor={altBkColor} />
      </KnobFrame>
    );
  } else {
    const scale = knobScales[size];
    const sz = uiSizes.knobMain;
    return (
      <UiScaler scale={scale} originalWidth={sz} originalHeight={sz}>
        <KnobFrame onPointerDown={handlePointerDown}>
          <FeKnobView label={label} value={normValue} altBkColor={altBkColor} />
        </KnobFrame>
      </UiScaler>
    );
  }
};
