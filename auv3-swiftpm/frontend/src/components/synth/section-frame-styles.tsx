import { css } from "@emotion/react";
import { borderSpec2 } from "@/common/ui-helper";
import { flexCentered, flexVertical, npx } from "@/common/utility-styles";
import { feColorDefs } from "@/components/synth/common/color-defs";

const sxSectionFrameCommonAttrs = {
  background: feColorDefs.sectionBg,
  border: "inset 1px #0004",
  borderRadius: "2px",
};

const sectionConfig = {
  unitWidth: 264,
};
const suw = sectionConfig.unitWidth;

export const cssSectionFrame2U = css({
  ...sxSectionFrameCommonAttrs,
  width: npx(suw * 2 + 8),
  padding: "0 14px 6px",
});

export const cssSectionFrameUpper = css({
  ...sxSectionFrameCommonAttrs,
  width: npx(suw),
  ...flexVertical(4),
  padding: "16px 14px 16px",
});

export const cssSectionFrameLower = css({
  ...sxSectionFrameCommonAttrs,
  width: npx(suw),
  ...flexVertical(4),
  padding: "10px 14px 20px",
});

export const cssSectionFrameMotionUpper = css({
  ...sxSectionFrameCommonAttrs,
  width: npx(suw),
  ...flexCentered(),
  padding: "14px 0 22px",
});

export const cssSectionFrameMotionLower = css({
  ...sxSectionFrameCommonAttrs,
  width: npx(suw),
  ...flexCentered(),
  padding: "22px 0 14px",
});

export const cssSectionFrameBottom = css({
  ...sxSectionFrameCommonAttrs,
  width: npx(suw),
  padding: "12px 14px",
  minHeight: "142px",
});

export const cssSectionFrameBlank = css({
  width: npx(suw),
});

export const sxFeSectionFrameWithEdge = {
  background: "#aaa",
  ...borderSpec2(1, "#fff3", "#0003"),
};
