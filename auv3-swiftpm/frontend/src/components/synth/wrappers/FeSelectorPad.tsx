import { SelectorOption } from "@/common/selector-option";
import { sxGridLayeringBaseFull } from "@/common/utility-styles";
import { ButtonFrame } from "@/components/general/ButtonFrame";
import {
  UnitSizeSpec,
  unitSizeToAsr,
} from "@/components/synth/common/ui-sizes";
import { useSelectorModel } from "@/components/synth/common/use-selector-model";
import { FeButtonView } from "@/components/synth/parts/FeButtonView";
import { FeButtonContentTwoColumn } from "@/components/synth/wrappers/FeButtonContentTwoColumn";
import { FeHorizontalSelectorPadCoverView } from "../parts/FeHorizontalSelectorPadCoverView";

type Props<T extends string | number> = {
  values?: T[];
  options?: SelectorOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  bidirectional?: boolean;
  unitSize?: UnitSizeSpec;
};

export const FeSelectorPad = <T extends string | number>({
  values,
  options,
  value,
  onChange,
  label,
  bidirectional,
  unitSize,
}: Props<T>) => {
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
