import { ReactNode } from "react";
import { FeButtonView } from "@/components/synth/parts/FeButtonView";

type Props = {
  children?: ReactNode;
};
export const FeStepPadButtonView = ({ children }: Props) => {
  return <FeButtonView children={children} baseHeight={70} unitSize={0.65} />;
};
