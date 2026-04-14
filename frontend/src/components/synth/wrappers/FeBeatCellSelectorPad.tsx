import { ReactNode } from "react";
import { sxGridLayeringBaseFull } from "@/common/utility-styles";
import { ButtonFrame } from "@/components/general/ButtonFrame";
import { useSelectorModel } from "@/components/synth/common/use-selector-model";
import { FeStepPadButtonView } from "@/components/synth/parts/FeStepPadButtonView";
import { FeVerticalSelectorPadCoverView } from "../parts/FeVerticalSelectorPadCoverView";

type Props<T extends string | number> = {
  values: T[];
  value: T;
  onChange: (value: T) => void;
  content: ReactNode;
};

export const FeBeatCellSelectorPad = <T extends string | number>({
  values,
  value,
  onChange,
  content,
}: Props<T>) => {
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
