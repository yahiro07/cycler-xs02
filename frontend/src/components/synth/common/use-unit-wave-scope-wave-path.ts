import { useMemo } from "react";
import { seqNumbers } from "@/utils/array-utils";

export const useUnitWaveScopeWavePath = ({
  waveFn,
  shape,
  nx,
  baseSize,
  ny,
  invertY,
}: {
  waveFn: (x: number, shape: number) => number;
  shape: number;
  nx: number;
  baseSize: number;
  ny: number;
  invertY?: boolean;
}) => {
  const width = baseSize * nx;
  const height = baseSize * ny;
  const steps = baseSize * nx;

  return useMemo(() => {
    const dx = 1 / steps;
    const points = seqNumbers(steps + 1).map((i) => {
      const x = i * dx;
      let y = waveFn(x, shape);
      if (invertY) y = 1 - y;
      return { x: x * width, y: (1 - y) * height };
    });
    return [
      `M 0 ${height}`,
      `L ${points[0].x} ${points[0].y}`,
      ...points.slice(1).map((p) => `L ${p.x} ${p.y}`),
      `L ${width} ${height}`,
      "Z",
    ].join(" ");
  }, [waveFn, width, height, steps, shape, invertY]);
};
