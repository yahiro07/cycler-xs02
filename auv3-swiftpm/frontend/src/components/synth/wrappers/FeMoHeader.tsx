import { ButtonFrame } from "@/components/general/ButtonFrame";
import { FeMoHeaderButtonView } from "@/components/synth/parts/FeMoHeaderButtonView";

type Props = {
  label: string;
  active: boolean;
  onClick?: () => void;
};
export const FeMoHeader = ({ label, active, onClick }: Props) => {
  return (
    <ButtonFrame onClick={onClick}>
      <FeMoHeaderButtonView children={label} active={active} />
    </ButtonFrame>
  );
};
