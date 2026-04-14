import { css } from "@emotion/react";
import { Icons } from "@/common/icons";
import { flexCentered } from "@/common/utility-styles";
import { useFullScreenModel } from "@/hooks/use-fullscreen-model";

export const FullscreenButton = () => {
  const { toggleFullscreen } = useFullScreenModel();
  return (
    <button type="button" css={style} onClick={toggleFullscreen}>
      <Icons.Fullscreen />
    </button>
  );
};
const style = css({
  width: "32px",
  height: "32px",
  border: "solid 1px #444",
  background: "#888",
  color: "#fff",
  borderRadius: "4px",
  cursor: "pointer",
  ...flexCentered(),
});
