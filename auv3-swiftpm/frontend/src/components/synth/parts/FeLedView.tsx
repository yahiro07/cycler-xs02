import { css } from "@emotion/react";
import clsx from "clsx";
import { flexCentered, sxPseudoContentFull } from "@/common/utility-styles";
import { feColorDefs } from "@/components/synth/common/color-defs";

type Props = {
  active?: boolean;
};
export const FeLedView = ({ active }: Props) => {
  return (
    <div css={styles.base} className={clsx(active && "--active")}>
      <div css={styles.body} />
    </div>
  );
};
const styles = {
  base: css({
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    ...flexCentered(),
    border: "inset 1px #fff2",
    background: "#222",
    padding: "1px",
  }),
  body: css({
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "#666",
    ".--active > &::before": {
      ...sxPseudoContentFull,
      borderRadius: "50%",
      // background: "linear-gradient(135deg, #fff2, #0004)",
      background: "radial-gradient(circle at 30% 25%, #fff3, transparent 50%)",
    },
    // border: "solid 2px #fff1",
    ".--active > &": {
      background: feColorDefs.ledActive,
    },
  }),
};
