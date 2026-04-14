import { css } from "@emotion/react";
import clsx from "clsx";
import { Icons } from "@/common/icons";
import { flexCentered } from "@/common/utility-styles";
import { sxHoldCommon } from "@/components/synth/common/hold-effect-styles";
import { usePointerHold } from "@/hooks/use-pointer-hold";

type Props = {
  invert?: boolean;
  active?: boolean;
};
export const FeMoArrowButtonView = ({ invert, active }: Props) => {
  const { hold, handlers } = usePointerHold();
  return (
    <div
      css={styles}
      className={clsx(
        invert && "--invert",
        active && "--active",
        hold && "--hold",
      )}
      {...handlers}
    >
      <Icons.Triangle />
    </div>
  );
};
const styles = css({
  width: "36px",
  height: "32px",
  fontSize: "20px",
  ...flexCentered(),
  color: "#888",
  "&.--invert": {
    transform: "rotate(180deg)",
  },
  "&.--active": {
    color: "#458",
  },
  "&.--hold": {
    ...sxHoldCommon,
  },
});
