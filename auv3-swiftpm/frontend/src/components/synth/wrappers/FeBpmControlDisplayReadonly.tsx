import { FeTempoDisplayView } from "@/components/synth/parts/FeTempoDisplayView";

type Props = {
  bpm: number;
};
export const FeBpmControlDisplayReadonly = ({ bpm }: Props) => {
  return <FeTempoDisplayView value={bpm} readonly={true} />;
};
