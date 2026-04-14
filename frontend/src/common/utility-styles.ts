export function npx(value: number, fracDigits?: number) {
  if (fracDigits && Number.isFinite(fracDigits)) {
    return `${value.toFixed(fracDigits)}px`;
  } else {
    return `${value}px`;
  }
}

export function flexAligned(gap?: number) {
  return {
    display: "flex",
    alignItems: "center",
    ...(gap && { gap: npx(gap) }),
  } as const;
}

export function flexVertical(gap?: number) {
  return {
    display: "flex",
    flexDirection: "column",
    ...(gap && { gap: npx(gap) }),
  } as const;
}

export function flexCentered(gap?: number) {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...(gap && { gap: npx(gap) }),
  } as const;
}

export function flexVerticalAligned(gap?: number) {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    ...(gap && { gap: npx(gap) }),
  } as const;
}
export const sxGridLayeringBase = {
  display: "grid",
  placeItems: "center",
  " > *": {
    gridArea: "1 / 1",
  },
};

export const sxGridLayeringBaseFull = {
  display: "grid",
  placeItems: "center",
  " > *": {
    gridArea: "1 / 1",
    width: "100%",
    height: "100%",
  },
};

export const sxFullSize = {
  width: "100%",
  height: "100%",
};

export const sxPseudoContentFull = {
  display: "block",
  content: '""',
  width: "100%",
  height: "100%",
};
