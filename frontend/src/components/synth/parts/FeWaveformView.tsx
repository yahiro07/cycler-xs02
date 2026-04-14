import { css } from "@emotion/react";
import { flexCentered, npx } from "@/common/utility-styles";
import { uiSizes } from "@/components/synth/common/ui-sizes";

type Props = {
  path: string;
  baseSize?: number;
};
export const FeWaveformView = ({
  path,
  baseSize = uiSizes.waveDisplay,
}: Props) => {
  return (
    <div css={styles.base}>
      <svg
        viewBox={`0 0 ${baseSize} ${baseSize}`}
        style={{ width: npx(baseSize), height: npx(baseSize) }}
      >
        <title>waveform</title>
        <path d={path} css={styles.svgPath} />
      </svg>
    </div>
  );
};
const styles = {
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
