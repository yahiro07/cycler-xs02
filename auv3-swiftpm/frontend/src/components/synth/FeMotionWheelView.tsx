import { css } from "@emotion/react";
import clsx from "clsx";
import { cssKeyFrameSpin } from "@/common/ui-helper";
import { flexCentered } from "@/common/utility-styles";
import { usePointerHold } from "@/hooks/use-pointer-hold";
import { sxHoldCommon } from "./hold-effect";
import { WheelSvg } from "./WheelSvg";

export const FeMotionWheelView = ({
  active,
  spinSpeed,
}: {
  active?: boolean;
  spinSpeed?: number;
}) => {
  const { hold, handlers } = usePointerHold();
  return (
    <div
      css={styleFeMotionWheelView.base}
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
const styleFeMotionWheelView = {
  base: css({
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
  }),
};
