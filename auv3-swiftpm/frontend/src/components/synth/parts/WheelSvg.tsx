function donutPath(outerRadius: number, innerRadius: number) {
  const d1 = outerRadius * 2;
  const d2 = innerRadius * 2;
  return [
    `M ${d1} 0 A ${d1} ${d1} 0 1 0 -${d1} 0 A ${d1} ${d1} 0 1 0 ${d1} 0 Z`,
    `M ${d2} 0 A ${d2} ${d2} 0 1 0 -${d2} 0 A ${d2} ${d2} 0 1 0 ${d2} 0 Z`,
  ].join(" ");
}

const paths = {
  spoke:
    "M 10,-10.1 L 70,-10.1 L 80,-20 L 90, -20, L 90, 20, L 80,20 L 70,10.1 L 10,10.1 L 0,20 L 0,16 L 8,0 L 0,-16  L 0,-20 z",
  rim: donutPath(50, 40),
  shaft: donutPath(5, 3),
};
export const WheelSvg = ({
  color,
  style,
}: {
  color: string;
  style?: React.CSSProperties;
}) => {
  return (
    <svg width="200" height="200" viewBox="-100 -100 200 200" style={style}>
      <title>wheel</title>
      <path d={paths.rim} fill={color} fillRule="evenodd" />
      <path d={paths.spoke} fill={color} transform="rotate(90)" />
      <path d={paths.spoke} fill={color} transform="rotate(-150)" />
      <path d={paths.spoke} fill={color} transform="rotate(-30)" />
      <path d={paths.shaft} fill={color} fillRule="evenodd" />
    </svg>
  );
};
