import { css } from "@emotion/react";
import { useCallback, useRef, useState } from "react";
import { flexCentered } from "@/common/utility-styles";
import { FePadButton } from "@/components/synth";
import { useHandleClickOutside } from "@/hooks/use-handle-click-outside";
import { seqNumbers } from "@/utils/array-utils";

const noteIndexToNoteNameMap: Record<number, string> = {
  0: "C",
  1: "C#",
  2: "D",
  3: "D#",
  4: "E",
  5: "F",
  6: "F#",
  7: "G",
  8: "G#",
  9: "A",
  10: "A#",
  11: "B",
};

const KeySettingsPanel = ({
  baseNoteIndex,
  setBaseNoteIndex,
  closePanel,
}: {
  baseNoteIndex: number;
  setBaseNoteIndex: (index: number) => void;
  closePanel: () => void;
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  useHandleClickOutside(panelRef, closePanel);

  const handleButton = (i: number) => {
    if (i === baseNoteIndex) {
      closePanel();
    } else {
      setBaseNoteIndex(i);
    }
  };
  return (
    <div ref={panelRef} css={cssKeySettingsPanel}>
      {seqNumbers(12).map((i) => (
        <button
          type="button"
          key={i}
          onClick={() => handleButton(i)}
          css={{
            background: baseNoteIndex === i ? "#6cf" : "#fff",
          }}
        >
          {noteIndexToNoteNameMap[i]}
        </button>
      ))}
    </div>
  );
};
const cssKeySettingsPanel = css({
  position: "absolute",
  left: 0,
  top: "-101px",
  width: "180px",
  background: "#fff",
  display: "flex",
  flexWrap: "wrap-reverse",
  zIndex: 1,
  color: "#444",
  "&>div": {
    width: "45px",
    height: "33px",
    fontSize: "16px",
    ...flexCentered(),
    cursor: "pointer",
  },
});

export const KeySettingsButton = ({
  baseNoteIndex,
  setBaseNoteIndex,
}: {
  baseNoteIndex: number;
  setBaseNoteIndex: (index: number) => void;
}) => {
  const [keySettingsPanelVisible, setKeySettingsPanelVisible] = useState(false);
  const closePanel = useCallback(() => setKeySettingsPanelVisible(false), []);

  const togglePanel = () => {
    setKeySettingsPanelVisible((prev) => !prev);
  };

  return (
    <div css={{ position: "relative" }}>
      <FePadButton
        children={`root ${noteIndexToNoteNameMap[baseNoteIndex]}`}
        onClick={togglePanel}
      />
      {keySettingsPanelVisible && (
        <KeySettingsPanel
          baseNoteIndex={baseNoteIndex}
          setBaseNoteIndex={setBaseNoteIndex}
          closePanel={closePanel}
        />
      )}
    </div>
  );
};
