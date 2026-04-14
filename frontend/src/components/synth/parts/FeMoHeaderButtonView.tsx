import { css } from "@emotion/react";
import clsx from "clsx";
import { ReactNode } from "react";
import { borderSpec2 } from "@/common/ui-helper";
import { flexCentered, npx } from "@/common/utility-styles";
import { sxButtonHoldCommon } from "@/components/synth/common/hold-effect-styles";
import { usePointerHold } from "@/hooks/use-pointer-hold";

type Props = {
  children: ReactNode;
  baseHeight?: number;
  unitSize?: number;
  active?: boolean;
};
export const FeMoHeaderButtonView = ({
  children,
  baseHeight = 34,
  unitSize = 1.5,
  active,
}: Props) => {
  const { hold, handlers } = usePointerHold();
  return (
    <div
      css={styles}
      style={{ height: npx(baseHeight), aspectRatio: unitSize }}
      className={clsx(active && "--active", hold && "--hold")}
      {...handlers}
    >
      {children}
    </div>
  );
};
const styles = css({
  ...flexCentered(),
  background: "#e4e5e8",
  color: "#556",
  ...borderSpec2(1, "#fff3", "#0003"),
  borderRadius: "1px",
  "&.--active": {
    background: "#7494dd",
    color: "#fff",
  },
  "&.--hold": {
    ...sxButtonHoldCommon,
  },
});
