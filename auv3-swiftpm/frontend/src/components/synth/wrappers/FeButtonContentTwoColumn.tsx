import { ReactNode } from "react";
import { npx } from "@/common/utility-styles";

type Props = {
  textSize: number;
  negativeGap?: number;
  children: ReactNode;
};

export const FeButtonContentTwoColumn = ({
  textSize,
  negativeGap,
  children,
}: Props) => {
  return (
    <div
      className="flex-vc"
      css={{
        fontSize: npx(textSize),
        "> :first-of-type": {
          marginBottom: npx(-(negativeGap ?? 0)),
        },
      }}
    >
      {children}
    </div>
  );
};
