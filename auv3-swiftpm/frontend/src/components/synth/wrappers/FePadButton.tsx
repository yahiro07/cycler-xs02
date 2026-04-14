import { ButtonFrame } from "@/components/general/ButtonFrame";
import {
  UnitSizeSpec,
  unitSizeToAsr,
} from "@/components/synth/common/ui-sizes";
import { FeButtonView } from "@/components/synth/parts/FeButtonView";

type Props = {
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  unitSize?: UnitSizeSpec;
};
export const FePadButton = ({ active, onClick, children, unitSize }: Props) => {
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
