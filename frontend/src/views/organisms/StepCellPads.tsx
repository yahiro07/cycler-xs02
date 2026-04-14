import {
  ExGaterCode,
  exGaterCodeValues,
  exGaterCodeValuesForHead,
  GateSequencerCode,
  gateSequencerCodeValues,
  gateSequencerCodeValuesForHead,
} from "@/base/parameters";
import { store } from "@/central/store";
import { Icons } from "@/common/icons";
import { FeBeatCellSelectorPad } from "@/components/synth";

const codeToTextMap: Record<GateSequencerCode, string> = {
  "0": "oooo",
  "1": "ooo>",
  "2": "oo>o",
  "3": "o>oo",
  "4": ">ooo",
  "5": ">oo>",
};
const GaterSeqContent = ({ code }: { code: GateSequencerCode }) => {
  const texts = codeToTextMap[code].split("");
  return (
    <div className="flex-ha">
      {texts.map((text, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed length items
        <div key={index}>
          {text === "o" ? (
            <Icons.DotFill className="mx-[-2px] text-[14px]" />
          ) : (
            <Icons.AngleRight className="m-[-1.1px] text-[12px]" />
          )}
        </div>
      ))}
    </div>
  );
};

const ExStepsContent = ({ code }: { code: ExGaterCode }) => {
  return (
    <div>
      {code === ExGaterCode.off && <Icons.Dash className="text-[20px]" />}
      {code === ExGaterCode.one && <Icons.DotFill className="text-[14px]" />}
      {code === ExGaterCode.tie && <Icons.AngleRight className="text-[12px]" />}
      {code === ExGaterCode.two && (
        <div className="flex-c">
          <Icons.DotFill className="mx-[-1.5px] text-[14px]" />
          <Icons.DotFill className="mx-[-1.5px] text-[14px]" />
        </div>
      )}
    </div>
  );
};

export const StepCellPadsMain = () => {
  const {
    gaterSeqPatterns_0,
    gaterSeqPatterns_1,
    gaterSeqPatterns_2,
    gaterSeqPatterns_3,
  } = store.useSnapshot();
  const {
    setGaterSeqPatterns_0,
    setGaterSeqPatterns_1,
    setGaterSeqPatterns_2,
    setGaterSeqPatterns_3,
  } = store.mutations;
  const codes = [
    gaterSeqPatterns_0,
    gaterSeqPatterns_1,
    gaterSeqPatterns_2,
    gaterSeqPatterns_3,
  ];
  const setCodes = [
    setGaterSeqPatterns_0,
    setGaterSeqPatterns_1,
    setGaterSeqPatterns_2,
    setGaterSeqPatterns_3,
  ];
  return codes.map((code, i) => (
    <FeBeatCellSelectorPad<GateSequencerCode>
      // biome-ignore lint/suspicious/noArrayIndexKey: fixed length items
      key={i}
      content={<GaterSeqContent code={code} />}
      values={
        i === 0 ? gateSequencerCodeValuesForHead : gateSequencerCodeValues
      }
      value={code}
      onChange={(v) => setCodes[i](v)}
    />
  ));
};

export const StepCellPadsEx = () => {
  const { exGaterCodes_0, exGaterCodes_1, exGaterCodes_2, exGaterCodes_3 } =
    store.useSnapshot();
  const {
    setExGaterCodes_0,
    setExGaterCodes_1,
    setExGaterCodes_2,
    setExGaterCodes_3,
  } = store.mutations;
  const codes = [
    exGaterCodes_0,
    exGaterCodes_1,
    exGaterCodes_2,
    exGaterCodes_3,
  ];
  const setCodes = [
    setExGaterCodes_0,
    setExGaterCodes_1,
    setExGaterCodes_2,
    setExGaterCodes_3,
  ];
  return codes.map((code, i) => (
    <FeBeatCellSelectorPad<ExGaterCode>
      // biome-ignore lint/suspicious/noArrayIndexKey: fixed length items
      key={i}
      content={<ExStepsContent code={code} />}
      values={i === 0 ? exGaterCodeValuesForHead : exGaterCodeValues}
      value={code}
      onChange={(v) => setCodes[i](v)}
    />
  ));
};
