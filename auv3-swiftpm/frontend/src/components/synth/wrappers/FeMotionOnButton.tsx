import { ButtonFrame } from "@/components/general/ButtonFrame";
import { FeMotionWheelView } from "@/components/synth/parts/FeMotionWheelView";

type Props = {
  active: boolean;
  onClick: () => void;
  spinSpeed: number;
};
export const FeMotionOnButton = ({ active, onClick, spinSpeed }: Props) => {
  return (
    <ButtonFrame onClick={onClick}>
      <FeMotionWheelView active={active} spinSpeed={spinSpeed} />
    </ButtonFrame>
  );
};
