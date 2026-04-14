import { ButtonFrame } from "@/components/general/ButtonFrame";
import { FeButtonView } from "@/components/synth/parts/FeButtonView";

type Props = {
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  width: number;
  height: number;
};

export const FePadButtonRawSize = ({
  active,
  onClick,
  children,
  width,
  height,
}: Props) => {
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
