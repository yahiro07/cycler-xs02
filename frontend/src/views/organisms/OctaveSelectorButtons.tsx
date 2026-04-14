import { FePadButtonRawSize } from "@/components/synth";

export const OctaveSelectorButtons = ({
  octave,
  setOctave,
}: {
  octave: number;
  setOctave: (octave: number) => void;
}) => {
  const w = 45;
  const h = 32;
  return (
    <div className="flex flex-col gap-[3px]">
      <FePadButtonRawSize
        children="+1"
        active={octave === 1}
        onClick={() => setOctave(1)}
        width={w}
        height={h}
      />
      <FePadButtonRawSize
        children="0"
        active={octave === 0}
        onClick={() => setOctave(0)}
        width={w}
        height={h}
      />
      <FePadButtonRawSize
        children="-1"
        active={octave === -1}
        onClick={() => setOctave(-1)}
        width={w}
        height={h}
      />
    </div>
  );
};
