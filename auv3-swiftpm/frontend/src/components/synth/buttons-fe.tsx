import { ReactNode } from "react";
import { SelectorOption } from "@/common/selector-option";
import { sxGridLayeringBaseFull } from "@/common/utility-styles";
import { ButtonFrame } from "@/components/general/ButtonFrame";
import {
  FeButtonViewA1,
  FeHorizontalSelectorPadCoverView,
  FeStepPadButtonView,
  FeVerticalSelectorPadCoverView,
} from "./button-views";
import { useSelectorModel } from "./use-selector-model";
import { FeButtonContentTwoColumn } from "./views";

const unitSizeToAsrMap = {
  u11: 1.05,
  u15: 1.55,
  u18: 1.8,
  u20: 2,
} satisfies Record<string, number>;

type UnitSizeSpec = keyof typeof unitSizeToAsrMap | number;

const FeButtonView = FeButtonViewA1;

function unitSizeToAsr(unitSize: UnitSizeSpec = "u18") {
  if (typeof unitSize === "number") {
    return unitSize;
  }
  return unitSizeToAsrMap[unitSize];
}

export const FePadButton = ({
  active,
  onClick,
  children,
  unitSize,
}: {
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  unitSize?: UnitSizeSpec;
}) => {
  return (
    <ButtonFrame onClick={onClick}>
      <FeButtonView
        active={active}
        children={children}
        unitSize={unitSizeToAsr(unitSize)}
      />
    </ButtonFrame>
  );
};

export const FePadButtonRawSize = ({
  active,
  onClick,
  children,
  width,
  height,
}: {
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  width: number;
  height: number;
}) => {
  return (
    <ButtonFrame onClick={onClick}>
      <FeButtonView
        active={active}
        children={children}
        baseHeight={height}
        unitSize={width / height}
      />
    </ButtonFrame>
  );
};

export const FeSelectorPad = <T extends string | number>({
  values,
  options,
  value,
  onChange,
  label,
  bidirectional,
  unitSize,
}: {
  values?: T[];
  options?: SelectorOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  bidirectional?: boolean;
  unitSize?: UnitSizeSpec;
}) => {
  const { valueText, handleClick, canShiftForward, canShiftBackward } =
    useSelectorModel({
      values,
      options,
      value,
      onChange,
      bidirectional,
    });

  return (
    <ButtonFrame onClick={handleClick}>
      <FeButtonView unitSize={unitSizeToAsr(unitSize)}>
        <div css={sxGridLayeringBaseFull} className="w-full h-full">
          {label ? (
            <FeButtonContentTwoColumn textSize={14} negativeGap={5}>
              <div>{label}</div>
              <div>{valueText}</div>
            </FeButtonContentTwoColumn>
          ) : (
            <div className="flex-c">{valueText}</div>
          )}
          {bidirectional && (
            <FeHorizontalSelectorPadCoverView
              leftVisible={canShiftBackward}
              rightVisible={canShiftForward}
            />
          )}
        </div>
      </FeButtonView>
    </ButtonFrame>
  );
};

export const FeBeatCellSelectorPad = <T extends string | number>({
  values,
  value,
  onChange,
  content,
}: {
  values: T[];
  value: T;
  onChange: (value: T) => void;
  content: ReactNode;
}) => {
  const { handleClick, canShiftForward, canShiftBackward } = useSelectorModel({
    values,
    value,
    onChange,
    bidirectional: true,
    isVertical: true,
    isVerticalInverted: true,
  });
  return (
    <ButtonFrame onClick={handleClick}>
      <FeStepPadButtonView>
        <div css={sxGridLayeringBaseFull} className="w-full h-full">
          <div className="flex-c">{content}</div>
          <FeVerticalSelectorPadCoverView
            upVisible={canShiftForward}
            downVisible={canShiftBackward}
          />
        </div>
      </FeStepPadButtonView>
    </ButtonFrame>
  );
};
