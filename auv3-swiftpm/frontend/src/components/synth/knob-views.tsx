import { css } from "@emotion/react";
import clsx from "clsx";
import {
  flexCentered,
  flexVerticalAligned,
  npx,
  sxGridLayeringBaseFull,
} from "@/common/utility-styles";
import { usePointerHold } from "@/hooks/use-pointer-hold";
import { mapUnaryTo } from "@/utils/number-utils";
import { KnobRing } from "./KnobRing";
import { feColorDefs, uiSizes } from "./ui-defs";

const knobRingConfigs = {
  ringThickness: 8,
  radius: uiSizes.knobMain / 2 + 8 - 1,
};

export const FeMotionKnobRing = ({
  arcRange,
}: {
  arcRange: [number, number];
}) => {
  const { ringThickness, radius } = knobRingConfigs;
  return (
    <KnobRing
      radius={radius}
      lineWidth={ringThickness}
      color={feColorDefs.knobIndicator}
      arcRange={arcRange}
      tickHalfAngle={140}
    />
  );
};
export const FeMotionKnobRingDummy = () => {
  const size = knobRingConfigs.radius * 2;
  return <div style={{ width: npx(size), height: npx(size) }} />;
};

export const FeKnobView = ({
  label,
  value,
  diameter = uiSizes.knobMain,
  altBkColor = false,
}: {
  label: string;
  value: number;
  diameter?: number;
  altBkColor?: boolean;
}) => {
  const { hold, handlers } = usePointerHold();
  const tickAngle = mapUnaryTo(value, -140, 140);
  return (
    <div
      css={styleFeKnobView.base}
      style={{ width: npx(diameter), height: npx(diameter) }}
      className={clsx(altBkColor && "--alt-bk-color", hold && "--hold")}
      {...handlers}
    >
      <div css={styleFeKnobView.body} />
      <div css={styleFeKnobView.labelLayer}>{label}</div>
      <div
        css={styleFeKnobView.tickLayer}
        style={{ transform: `rotate(${tickAngle}deg)` }}
      >
        <div css={styleFeKnobView.tick} />
      </div>
    </div>
  );
};
const styleFeKnobView = {
  base: css({
    borderRadius: "50%",
    border: "inset 1px #fff1",
    ...sxGridLayeringBaseFull,
    background: "#383838",
    "&.--alt-bk-color": {
      background: "#0002",
    },
    padding: "3px",
    "&.--hold": {
      // ...sxHoldCommon,
    },
  }),
  body: css({
    borderRadius: "50%",
    background: "linear-gradient(to top, #aaa, #fff)",
    padding: "5px",
    "&::before": {
      content: "''",
      width: "100%",
      height: "100%",
      ...flexCentered(),
      // border: "solid 0.3 px #fff4",
      borderRadius: "50%",
      background: "#e8e8ec",
    },
  }),
  labelLayer: css({
    ...flexCentered(),
    fontSize: "17px",
    color: "#445",
  }),
  tickLayer: css({
    ...flexVerticalAligned(),
    // padding: "3px",
  }),
  tick: css({
    width: npx(4),
    height: npx(12),
    background: "#445",
  }),
};
