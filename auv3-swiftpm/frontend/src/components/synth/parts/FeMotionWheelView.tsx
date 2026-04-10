import { css } from "@emotion/react";
import clsx from "clsx";
import { cssKeyFrameSpin } from "@/common/ui-helper";
import { flexCentered } from "@/common/utility-styles";
import { usePointerHold } from "@/hooks/use-pointer-hold";
import { sxHoldCommon } from "../common/hold-effect-styles";
import { WheelSvg } from "./WheelSvg";

type Props = {
  active?: boolean;
  spinSpeed?: number;
};

export const FeMotionWheelView = ({ active, spinSpeed }: Props) => {
  const { hold, handlers } = usePointerHold();
  return (
    <div
      css={styles}
      style={{
        animation: spinSpeed ? `spin ${spinSpeed}s linear infinite` : undefined,
      }}
      className={clsx(hold && "--hold")}
      {...handlers}
    >
      <WheelSvg color={active ? "#fff" : "#666"} />
    </div>
  );
};
const styles = css({
  width: "36px",
  height: "36px",
  ...flexCentered(),
  ...cssKeyFrameSpin,
  "> svg": {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  "&.--hold": {
    ...sxHoldCommon,
  },
});
