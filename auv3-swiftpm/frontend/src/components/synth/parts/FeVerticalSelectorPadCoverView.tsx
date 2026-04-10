import { css } from "@emotion/react";
import { Icons } from "@/common/icons";
import { flexVerticalAligned } from "@/common/utility-styles";

type Props = {
  upVisible: boolean;
  downVisible: boolean;
};

export const FeVerticalSelectorPadCoverView = ({
  upVisible,
  downVisible,
}: Props) => {
  return (
    <div css={styles}>
      {upVisible ? <Icons.ArrowDropUp /> : <div />}
      {downVisible ? <Icons.ArrowDropDown /> : <div />}
    </div>
  );
};
const styles = css({
  ...flexVerticalAligned(),
  justifyContent: "space-between",
  fontSize: "17px",
  ">svg": {
    margin: "-2px 0",
  },
});
