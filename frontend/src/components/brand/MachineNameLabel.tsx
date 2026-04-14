import { FC } from "react";
import { npx } from "@/common/utility-styles";

export const MachineNameLabel: FC<{
  label: string;
  color: string;
  size?: number;
}> = ({ label, color, size = 42 }) => {
  return (
    <div
      css={{
        fontSize: npx(size),
        color,
        fontFamily: "Roboto Mono, system-ui, sans-serif",
        fontWeight: "500",
        lineHeight: npx(size),
      }}
    >
      {label}
    </div>
  );
};
