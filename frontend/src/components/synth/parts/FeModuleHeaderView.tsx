import { css } from "@emotion/react";
import clsx from "clsx";
import { flexAligned } from "@/common/utility-styles";
import { sxHoldCommon } from "@/components/synth/common/hold-effect-styles";
import { FeLedView } from "@/components/synth/parts/FeLedView";
import { usePointerHold } from "@/hooks/use-pointer-hold";

type Props = {
  label: string;
  active?: boolean;
};

export const FeModuleHeaderView = ({ label, active }: Props) => {
  const { hold, handlers } = usePointerHold();

  if (active === undefined) {
    <div css={styles.base} className={clsx(active !== false && "--active")}>
      <div css={styles.label}> {label} </div>
    </div>;
  }
  return (
    <div
      {...handlers}
      css={styles.base}
      className={clsx(active !== false && "--active", hold && "--hold")}
    >
      {active !== undefined && <FeLedView active={active} />}
      <div css={styles.label}> {label} </div>
    </div>
  );
};
const styles = {
  base: css({
    ...flexAligned(3),
    color: "#fff",
    "&.--hold": {
      ...sxHoldCommon,
    },
  }),
  label: css({
    fontSize: "24px",
    lineHeight: "1.2",
    color: "#777",
    ".--active > &": {
      color: "#fff",
    },
  }),
};
