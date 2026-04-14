import { npx } from "@/common/utility-styles";
import { mapUnaryTo } from "@/utils/number-utils";

function mapKnobAngle(value: number, halfAngle: number) {
  return mapUnaryTo(value, -halfAngle, halfAngle);
}

function getKnobRingPath(
  radius: number,
  arcAngleLow: number,
  arcAngleHigh: number,
) {
  const startAngle = arcAngleLow;
  const endAngle = arcAngleHigh;

  // Convert angles from degrees to radians
  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);

  // Calculate start and end points
  const x1 = radius * Math.cos(startRad);
  const y1 = radius * Math.sin(startRad);
  const x2 = radius * Math.cos(endRad);
  const y2 = radius * Math.sin(endRad);

  // Determine if arc should be large or small
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
}

export const FeKnobRing = ({
  radius,
  lineWidth,
  color,
  arcRange,
  tickHalfAngle,
  endRounded,
  className,
}: {
  radius: number;
  lineWidth: number;
  color: string;
  arcRange: [number, number];
  tickHalfAngle: number;
  endRounded?: boolean;
  className?: string;
}) => {
  const arcAngleLow = mapKnobAngle(arcRange[0], tickHalfAngle);
  const arcAngleHigh = mapKnobAngle(arcRange[1], tickHalfAngle);
  const path = getKnobRingPath(radius, arcAngleLow, arcAngleHigh);
  const radiusEx = radius + lineWidth / 2;
  return (
    <svg
      className={className}
      style={{
        width: npx(radius * 2),
        aspectRatio: 1,
        pointerEvents: "none",
      }}
      viewBox={`-${radiusEx} -${radiusEx} ${radiusEx * 2} ${radiusEx * 2}`}
    >
      <title>knob ring</title>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={lineWidth}
        strokeLinecap={endRounded ? "round" : "butt"}
      />
    </svg>
  );
};
