import { css } from "@emotion/react";
import { Icons } from "@/common/icons";
import { flexAligned } from "@/common/utility-styles";

type Props = {
  leftVisible: boolean;
  rightVisible: boolean;
};
export const FeHorizontalSelectorPadCoverView = ({
  leftVisible,
  rightVisible,
}: Props) => {
  return (
    <div css={styles}>
      {leftVisible ? <Icons.ArrowDropLeft /> : <div />}
      {rightVisible ? <Icons.ArrowDropRight /> : <div />}
    </div>
  );
};
const styles = css({
  ...flexAligned(),
  justifyContent: "space-between",
  fontSize: "20px",
  ">svg": {
    margin: "0 -4px",
  },
});
