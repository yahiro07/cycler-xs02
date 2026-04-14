export function borderSpec4(
  thickness: number,
  top: string,
  left: string,
  right: string,
  bottom: string,
) {
  return {
    border: `solid ${thickness}px ${top}`,
    borderTopColor: top,
    borderLeftColor: left,
    borderRightColor: right,
    borderBottomColor: bottom,
  };
}

export function borderSpec2(
  thickness: number,
  topLeft: string,
  bottomRight: string,
) {
  return {
    border: `solid ${thickness}px ${topLeft}`,
    borderTopColor: topLeft,
    borderLeftColor: topLeft,
    borderRightColor: bottomRight,
    borderBottomColor: bottomRight,
  };
}

export const cssKeyFrameSpin = {
  "@keyframes spin": {
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: "rotate(360deg)",
    },
  },
};
