// function hexToRgba(hex: string, alpha: number) {
//   const h = hex.replace("#", "").trim();
//   const full =
//     h.length === 3
//       ? h
//           .split("")
//           .map((c) => c + c)
//           .join("")
//       : h;
//   const r = parseInt(full.slice(0, 2), 16);
//   const g = parseInt(full.slice(2, 4), 16);
//   const b = parseInt(full.slice(4, 6), 16);
//   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
// }

// export function getBgCssSpec({
//   imageUrl,
//   overColor,
//   overAlpha,
// }: {
//   imageUrl: string;
//   overColor?: string;
//   overAlpha?: number;
// }) {
//   const alphaDefault = imageUrl ? 0 : 1;
//   const overColorRgba = overColor
//     ? hexToRgba(overColor, overAlpha ?? alphaDefault)
//     : undefined;
//   return {
//     backgroundImage: `linear-gradient(${overColorRgba}, ${overColorRgba}), url(${imageUrl})`,
//   };
// }

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
