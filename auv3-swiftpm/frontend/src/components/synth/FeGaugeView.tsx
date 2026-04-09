import { css } from "@emotion/react";
import clsx from "clsx";
import { borderSpec2 } from "@/common/ui-helper";
import { npx } from "@/common/utility-styles";
import { sxHoldCommon } from "@/components/synth/hold-effect";
import { feColorDefs } from "@/components/synth/ui-defs";
import { usePointerHold } from "@/hooks/use-pointer-hold";

export const FeGaugeView = ({
  value: normValue,
  width = 30,
  height: baseHeight = 82,
  active,
}: {
  value: number;
  width?: number;
  height?: number;
  active?: boolean;
}) => {
  const { hold, handlers } = usePointerHold();
  const knobSize = width;
  const travel = baseHeight - knobSize;
  const knobTop = (1 - normValue) * travel;
  const fillHeight = normValue * travel;

  return (
    <div
      css={styles.base}
      style={{ width: npx(width), height: npx(baseHeight) }}
      className={clsx(hold && "--hold")}
      {...handlers}
    >
      <div css={styles.visuals} aria-hidden>
        <div css={styles.grooveBase}>
          <div
            css={styles.grooveFill}
            style={{ height: `${fillHeight}px` }}
            className={clsx(active && "--active")}
          />
        </div>
        <div
          css={styles.knob}
          className={clsx(active && "--active")}
          style={{ top: `${knobTop}px` }}
        />
      </div>
    </div>
  );
};
const styles = {
  base: css({
    position: "relative",
    overflow: "hidden",
    "&.--hold": {
      ...sxHoldCommon,
    },
  }),
  visuals: css({
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  }),
  grooveBase: css({
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    width: "6px",
    transform: "translateX(-50%)",
    ...borderSpec2(0.5, "#000", "#484848"),
    background: "#282828",
    borderRadius: "1px",
    overflow: "hidden",
  }),
  grooveFill: css({
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    "&.--active": {
      background: feColorDefs.knobIndicator,
    },
  }),
  knob: css({
    position: "absolute",
    left: 0,
    width: "100%",
    aspectRatio: 1,
    borderRadius: "7px",
    background: "#666",
    border: "solid 1px #333",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      width: "100%",
      height: "100%",
      borderRadius: "6px",
      ...borderSpec2(1, "#fff2", "#0002"),
    },
    "&.--active": {
      background: "#0aa",
    },
  }),
};
