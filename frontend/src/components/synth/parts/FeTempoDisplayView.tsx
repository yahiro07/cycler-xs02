import { css } from "@emotion/react";
import clsx from "clsx";
import { borderSpec4 } from "@/common/ui-helper";
import { sxHoldCommon } from "@/components/synth/common/hold-effect-styles";
import { usePointerHold } from "@/hooks/use-pointer-hold";

type Props = {
  value: number;
  readonly?: boolean;
};

export const FeTempoDisplayView = ({ value, readonly }: Props) => {
  const { hold, handlers } = usePointerHold();
  return (
    <div
      {...handlers}
      css={styles}
      className={clsx(!readonly && hold && "--hold", readonly && "--readonly")}
    >
      <div>{Math.round(value)}</div>
    </div>
  );
};
const styles = css({
  ...borderSpec4(1, "#0004", "#0004", "#fff2", "#fff2"),
  borderRadius: "8px",
  background: "#4444",
  padding: "1px",
  position: "relative",
  ">div": {
    width: "90px",
    height: "50px",
    borderRadius: "6px",
    background: "linear-gradient(135deg, #d0e8e0, #e0f0e8)",
    border: "2px solid #c0d8d0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "4px",
    fontFamily: '"Alarm Clock", monospace',
    fontSize: "40px",
    color: "#2a2a2a",
  },
  "&.--hold": {
    ...sxHoldCommon,
  },
  "&.--readonly": {
    "&::after": {
      content: "''",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "#0003",
    },
  },
});
