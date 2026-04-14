import { css } from "@emotion/react";
import clsx from "clsx";
import { ReactNode } from "react";
import { borderSpec4 } from "@/common/ui-helper";
import { npx, sxFullSize, sxGridLayeringBase } from "@/common/utility-styles";
import { feColorDefs } from "@/components/synth/common/color-defs";
import { sxButtonHoldCommon } from "@/components/synth/common/hold-effect-styles";
import { usePointerHold } from "@/hooks/use-pointer-hold";

type Props = {
  children?: ReactNode;
  baseHeight?: number;
  unitSize?: number;
  active?: boolean;
};
export const FeButtonView = ({
  children,
  baseHeight = 38,
  unitSize = 2,
  active,
}: Props) => {
  const { hold, handlers } = usePointerHold();
  return (
    <div
      {...handlers}
      css={styles.base}
      style={{
        height: npx(baseHeight),
        width: npx(Math.round(baseHeight * unitSize)),
      }}
      className={clsx(active && "--active", hold && "--hold")}
    >
      <div css={styles.body}>
        <div />
      </div>
      {typeof children === "string" ? <div>{children}</div> : children}
    </div>
  );
};
const styles = {
  base: css({
    ...sxGridLayeringBase,
    color: "#fff",
    fontSize: "15px",
    "&.--hold": {
      ...sxButtonHoldCommon,
    },
  }),
  body: css({
    ...sxFullSize,
    background: "#222",
    padding: "2px",
    borderRadius: "6px",
    "> div": {
      height: "100%",
      background: feColorDefs.buttonBg,
      ...borderSpec4(1, "#fff3", "#fff3", "#8884", "#6664"),
      borderRadius: "5px",
    },
    ".--active > & > div": {
      background: "#46a",
    },
  }),
};
