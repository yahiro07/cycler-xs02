import { ButtonFrame } from "@/components/general/ButtonFrame";
import { KnobFrame } from "@/components/general/KnobFrame";
import { UiScaler } from "@/components/general/UiScaler";
import { FeMoHeaderButtonView } from "./button-views";
import { FeGaugeView } from "./FeGaugeView";
import { FeMotionWheelView } from "./FeMotionWheelView";
import { FeKnobView } from "./knob-views";
import { uiSizes } from "./ui-defs";
import { TickDisplayStepsSpec, useKnobModel } from "./use-knob-model";
import { useUnitWaveScopeWavePath } from "./use-unit-wave-scope-wave-path";
import {
  FeMoArrowButtonView,
  FeModuleHeaderView,
  FeTempoDisplayView,
  FeWaveformView,
} from "./views";

const knobScales = {
  main: 1,
  small: uiSizes.knobSmall / uiSizes.knobMain,
  xs: uiSizes.knobXs / uiSizes.knobMain,
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
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  tickDisplaySteps?: TickDisplayStepsSpec;
  size?: "main" | "small" | "xs";
  altBkColor?: boolean;
  onStartEdit?: () => void;
  onEndEdit?: () => void;
}) => {
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

export const FeMotionOnButton = ({
  active,
  onClick,
  spinSpeed,
}: {
  active: boolean;
  onClick: () => void;
  spinSpeed: number;
}) => {
  return (
    <ButtonFrame onClick={onClick}>
      <FeMotionWheelView active={active} spinSpeed={spinSpeed} />
    </ButtonFrame>
  );
};

export const FeModuleHeader = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => {
  if (onClick) {
    return (
      <ButtonFrame onClick={onClick}>
        <FeModuleHeaderView label={label} active={active} />
      </ButtonFrame>
    );
  } else {
    return <FeModuleHeaderView label={label} active={active} />;
  }
};

export const FeBpmControlDisplay = ({
  bpm,
  setBpm,
  min,
  max,
}: {
  bpm: number;
  setBpm(bpm: number): void;
  min: number;
  max: number;
}) => {
  const { handlePointerDown } = useKnobModel({
    value: bpm,
    onChange: setBpm,
    min,
    max,
    step: 1,
    dragRange: 400,
  });
  return (
    <KnobFrame onPointerDown={handlePointerDown}>
      <FeTempoDisplayView value={bpm} />
    </KnobFrame>
  );
};

export const FeBpmControlDisplayReadonly = ({ bpm }: { bpm: number }) => {
  return <FeTempoDisplayView value={bpm} readonly={true} />;
};

export const FeMoHeader = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick?: () => void;
}) => {
  return (
    <ButtonFrame onClick={onClick}>
      <FeMoHeaderButtonView children={label} active={active} />
    </ButtonFrame>
  );
};

export const FeMoArrowButton = ({
  invert,
  active,
  onClick,
}: {
  invert?: boolean;
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <ButtonFrame onClick={onClick}>
      <FeMoArrowButtonView invert={invert} active={active} />
    </ButtonFrame>
  );
};

export const FeSliderGauge = ({
  value,
  onChange,
  active,
  onTap,
  onStartEdit,
  onEndEdit,
}: {
  value: number;
  onChange: (value: number) => void;
  active?: boolean;
  onTap?: () => void;
  onStartEdit?: () => void;
  onEndEdit?: () => void;
}) => {
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

export const FeWaveDisplay = ({
  waveFn,
  shape = 0,
  invertY = false,
  baseSize = uiSizes.waveDisplay,
}: {
  waveFn: (x: number, shape: number) => number;
  shape?: number;
  invertY?: boolean;
  nx?: number;
  baseSize?: number;
}) => {
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
