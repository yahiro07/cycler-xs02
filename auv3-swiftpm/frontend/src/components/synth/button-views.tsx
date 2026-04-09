import { css } from "@emotion/react";
import clsx from "clsx";
import { ReactNode } from "react";
import { Icons } from "@/common/icons";
import { borderSpec2, borderSpec4 } from "@/common/ui-helper";
import {
  flexAligned,
  flexCentered,
  flexVerticalAligned,
  npx,
  sxFullSize,
  sxGridLayeringBase,
} from "@/common/utility-styles";
import { sxButtonHoldCommon } from "@/components/synth/hold-effect";
import { feColorDefs } from "@/components/synth/ui-defs";
import { usePointerHold } from "@/hooks/use-pointer-hold";

export const FeButtonViewA1 = ({
  children,
  baseHeight = 38,
  unitSize = 2,
  active,
}: {
  children?: ReactNode;
  baseHeight?: number;
  unitSize?: number;
  active?: boolean;
}) => {
  const { hold, handlers } = usePointerHold();
  return (
    <div
      {...handlers}
      css={styleFeButtonViewA1.base}
      style={{
        height: npx(baseHeight),
        width: npx(Math.round(baseHeight * unitSize)),
      }}
      className={clsx(active && "--active", hold && "--hold")}
    >
      <div css={styleFeButtonViewA1.body}>
        <div />
      </div>
      {typeof children === "string" ? <div>{children}</div> : children}
    </div>
  );
};
const styleFeButtonViewA1 = {
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

export const FeStepPadButtonView = ({ children }: { children?: ReactNode }) => {
  return <FeButtonViewA1 children={children} baseHeight={70} unitSize={0.65} />;
};

export const FeHorizontalSelectorPadCoverView = ({
  leftVisible,
  rightVisible,
}: {
  leftVisible: boolean;
  rightVisible: boolean;
}) => {
  return (
    <div css={cssFeHorizontalSelectorPadCoverView}>
      {leftVisible ? <Icons.ArrowDropLeft /> : <div />}
      {rightVisible ? <Icons.ArrowDropRight /> : <div />}
    </div>
  );
};
const cssFeHorizontalSelectorPadCoverView = css({
  ...flexAligned(),
  justifyContent: "space-between",
  fontSize: "20px",
  ">svg": {
    margin: "0 -4px",
  },
});

export const FeVerticalSelectorPadCoverView = ({
  upVisible,
  downVisible,
}: {
  upVisible: boolean;
  downVisible: boolean;
}) => {
  return (
    <div css={cssFeVerticalSelectorPadCoverView}>
      {upVisible ? <Icons.ArrowDropUp /> : <div />}
      {downVisible ? <Icons.ArrowDropDown /> : <div />}
    </div>
  );
};
const cssFeVerticalSelectorPadCoverView = css({
  ...flexVerticalAligned(),
  justifyContent: "space-between",
  fontSize: "17px",
  ">svg": {
    margin: "-2px 0",
  },
});

export const FeMoHeaderButtonView = ({
  children,
  baseHeight = 34,
  unitSize = 1.5,
  active,
}: {
  children: ReactNode;
  baseHeight?: number;
  unitSize?: number;
  active?: boolean;
}) => {
  const { hold, handlers } = usePointerHold();
  return (
    <div
      css={cssFeMoHeaderButtonView}
      style={{ height: npx(baseHeight), aspectRatio: unitSize }}
      className={clsx(active && "--active", hold && "--hold")}
      {...handlers}
    >
      {children}
    </div>
  );
};
const cssFeMoHeaderButtonView = css({
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
