import { css } from "@emotion/react";

export const SpinContainer = ({
  children,
  spinSpeed,
}: {
  children: React.ReactNode;
  spinSpeed?: number;
}) => {
  return (
    <div
      css={cssSpinContainer}
      style={
        spinSpeed
          ? { animation: `spin ${spinSpeed}s linear infinite` }
          : undefined
      }
    >
      {children}
    </div>
  );
};
const cssSpinContainer = css({
  "@keyframes spin": {
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: "rotate(360deg)",
    },
  },
});
