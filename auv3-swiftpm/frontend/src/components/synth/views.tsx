import { css } from "@emotion/react";
import clsx from "clsx";
import { ReactNode } from "react";
import { Icons } from "@/common/icons";
import { borderSpec2, borderSpec4 } from "@/common/ui-helper";
import {
  flexAligned,
  flexCentered,
  flexVertical,
  npx,
  sxPseudoContentFull,
} from "@/common/utility-styles";
import { usePointerHold } from "@/hooks/use-pointer-hold";
import { sxHoldCommon } from "./hold-effect";
import { feColorDefs, uiSizes } from "./ui-defs";

export const feCssSectionFrameF1 = css({
  padding: "12px",
  background: "#777",
  ...borderSpec4(1, "#0004", "rgba(0, 0, 0, 0.267)", "#fff3", "#fff3"),
});

const sxSectionFrameF2Attrs = {
  background: feColorDefs.sectionBg,
  border: "inset 1px #0004",
  borderRadius: "2px",
};

const sectionConfig = {
  unitWidth: 264,
};
const suw = sectionConfig.unitWidth;

export const feCssSectionFrameF2 = css({
  ...sxSectionFrameF2Attrs,
});

export const feCssSectionFrameF2_2U = css({
  ...sxSectionFrameF2Attrs,
  width: npx(suw * 2 + 8),
  padding: "0 14px 6px",
});

export const feCssSectionFrameF2U = css({
  ...sxSectionFrameF2Attrs,
  width: npx(suw),
  ...flexVertical(4),
  padding: "16px 14px 16px",
});

export const feCssSectionFrameF2D = css({
  ...sxSectionFrameF2Attrs,
  width: npx(suw),
  ...flexVertical(4),
  padding: "10px 14px 20px",
});

export const feCssSectionFrameF2MU = css({
  ...sxSectionFrameF2Attrs,
  width: npx(suw),
  ...flexCentered(),
  padding: "14px 0 22px",
});

export const feCssSectionFrameF2MD = css({
  ...sxSectionFrameF2Attrs,
  width: npx(suw),
  ...flexCentered(),
  padding: "22px 0 14px",
});

export const feCssSectionFrameF2B = css({
  ...sxSectionFrameF2Attrs,
  width: npx(suw),
  padding: "12px 14px",
  minHeight: "142px",
});

export const feCssBlankSectionFrame = css({
  width: npx(suw),
});

export const sxFeSectionFrameF3 = {
  background: "#aaa",
  ...borderSpec2(1, "#fff3", "#0003"),
};

export const FeTempoDisplayView = ({
  value,
  readonly,
}: {
  value: number;
  readonly?: boolean;
}) => {
  const { hold, handlers } = usePointerHold();
  return (
    <div
      {...handlers}
      css={cssFeTempoDisplayView}
      className={clsx(!readonly && hold && "--hold", readonly && "--readonly")}
    >
      <div>{value}</div>
    </div>
  );
};
const cssFeTempoDisplayView = css({
  ...borderSpec4(1, "#0004", "#0004", "#fff2", "#fff2"),
  borderRadius: "8px",
  background: "#4444",
  padding: "1px",
  position: "relative",
  ">div": {
    width: "90px",
    height: "50px",
    borderRadius: "6px",
    background: "linear-gradient(135deg, #d0e8e0, #e0f0e8)",
    border: "2px solid #c0d8d0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "4px",
    fontFamily: '"Alarm Clock", monospace',
    fontSize: "40px",
    color: "#2a2a2a",
  },
  "&.--hold": {
    ...sxHoldCommon,
  },
  "&.--readonly": {
    "&::after": {
      content: "''",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "#0003",
    },
  },
});

export const FeMoArrowButtonView = ({
  invert,
  active,
}: {
  invert?: boolean;
  active?: boolean;
}) => {
  const { hold, handlers } = usePointerHold();
  return (
    <div
      css={cssFeMoArrowButtonView}
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
const cssFeMoArrowButtonView = css({
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

export const FeWaveformView = ({
  path,
  baseSize = uiSizes.waveDisplay,
}: {
  path: string;
  baseSize?: number;
}) => {
  return (
    <div css={styleFeWaveformView.base}>
      <svg
        viewBox={`0 0 ${baseSize} ${baseSize}`}
        style={{ width: npx(baseSize), height: npx(baseSize) }}
      >
        <title>waveform</title>
        <path d={path} css={styleFeWaveformView.svgPath} />
      </svg>
    </div>
  );
};
const styleFeWaveformView = {
  base: css({
    ...flexCentered(),
    border: "solid 1px #09f",
    background: "#0001",
  }),
  svgPath: css({
    fill: "#07f6",
    stroke: "#09f",
    strokeWidth: 1,
  }),
};

export const FeModuleHeaderView = ({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) => {
  const { hold, handlers } = usePointerHold();

  if (active === undefined) {
    <div
      css={styleFeModuleHeaderView.base}
      className={clsx(active !== false && "--active")}
    >
      <div css={styleFeModuleHeaderView.label}> {label} </div>
    </div>;
  }
  return (
    <div
      {...handlers}
      css={styleFeModuleHeaderView.base}
      className={clsx(active !== false && "--active", hold && "--hold")}
    >
      {active !== undefined && <FeLedView1 active={active} />}
      <div css={styleFeModuleHeaderView.label}> {label} </div>
    </div>
  );
};
const styleFeModuleHeaderView = {
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

export const FeLedView0 = ({ active }: { active?: boolean }) => {
  return (
    <div css={styleFeLedView0.base} className={clsx(active && "--active")}>
      <div css={styleFeLedView0.lens} />
    </div>
  );
};

const styleFeLedView0 = {
  base: css({
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    ...flexCentered(),
    border: "inset 1px #fff3",
    background: "#222",
    padding: "1px",
  }),
  lens: css({
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "#777",
    ".--active > &": {
      background: feColorDefs.ledActive,
    },
  }),
};

export const FeLedView1 = ({ active }: { active?: boolean }) => {
  return (
    <div css={styleFeLedView1.base} className={clsx(active && "--active")}>
      <div css={styleFeLedView1.body} />
    </div>
  );
};
const styleFeLedView1 = {
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

export const FeButtonContentTwoColumn = ({
  textSize,
  negativeGap,
  children,
}: {
  textSize: number;
  negativeGap?: number;
  children: ReactNode;
}) => {
  return (
    <div
      className="flex-vc"
      css={{
        fontSize: npx(textSize),
        "> :first-of-type": {
          marginBottom: npx(-(negativeGap ?? 0)),
        },
      }}
    >
      {children}
    </div>
  );
};
