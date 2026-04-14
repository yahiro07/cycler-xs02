import { css } from "@emotion/react";
import clsx from "clsx";
import {
  flexCentered,
  flexVerticalAligned,
  npx,
  sxGridLayeringBaseFull,
} from "@/common/utility-styles";
import { uiSizes } from "@/components/synth/common/ui-sizes";
import { usePointerHold } from "@/hooks/use-pointer-hold";
import { mapUnaryTo } from "@/utils/number-utils";

type Props = {
  label: string;
  value: number;
  diameter?: number;
  altBkColor?: boolean;
};

export const FeKnobView = ({
  label,
  value,
  diameter = uiSizes.knobMain,
  altBkColor = false,
}: Props) => {
  const { hold, handlers } = usePointerHold();
  const tickAngle = mapUnaryTo(value, -140, 140);
  return (
    <div
      css={styles.base}
      style={{ width: npx(diameter), height: npx(diameter) }}
      className={clsx(altBkColor && "--alt-bk-color", hold && "--hold")}
      {...handlers}
    >
      <div css={styles.body} />
      <div css={styles.labelLayer}>{label}</div>
      <div
        css={styles.tickLayer}
        style={{ transform: `rotate(${tickAngle}deg)` }}
      >
        <div css={styles.tick} />
      </div>
    </div>
  );
};
const styles = {
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
