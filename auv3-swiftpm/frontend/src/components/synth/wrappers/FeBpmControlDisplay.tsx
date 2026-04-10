import { KnobFrame } from "@/components/general/KnobFrame";
import { useKnobModel } from "@/components/synth/common/use-knob-model";
import { FeTempoDisplayView } from "@/components/synth/parts/FeTempoDisplayView";

type Props = {
  bpm: number;
  setBpm(bpm: number): void;
  min: number;
  max: number;
};
export const FeBpmControlDisplay = ({ bpm, setBpm, min, max }: Props) => {
  const { handlePointerDown } = useKnobModel({
    value: bpm,
    onChange: setBpm,
    min,
    max,
    step: 1,
    dragRange: 400,
  });
  return (
    <KnobFrame onPointerDown={handlePointerDown}>
      <FeTempoDisplayView value={bpm} />
    </KnobFrame>
  );
};
