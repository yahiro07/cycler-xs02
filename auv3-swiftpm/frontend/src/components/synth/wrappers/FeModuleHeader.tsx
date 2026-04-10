import { ButtonFrame } from "@/components/general/ButtonFrame";
import { FeModuleHeaderView } from "@/components/synth/parts/FeModuleHeaderView";

type Props = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};
export const FeModuleHeader = ({ label, active, onClick }: Props) => {
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
