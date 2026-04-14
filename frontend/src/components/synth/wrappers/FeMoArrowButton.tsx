import { ButtonFrame } from "@/components/general/ButtonFrame";
import { FeMoArrowButtonView } from "@/components/synth/parts/FeMoArrowButtonView";

type Props = {
  invert?: boolean;
  active?: boolean;
  onClick?: () => void;
};
export const FeMoArrowButton = ({ invert, active, onClick }: Props) => {
  return (
    <ButtonFrame onClick={onClick}>
      <FeMoArrowButtonView invert={invert} active={active} />
    </ButtonFrame>
  );
};
