import { useEffect, useState } from "react";
import { ISize } from "@/common/general-types";

export function useWindowSize(): ISize {
  const [size, setSize] = useState<ISize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const affectSize = () => {
      requestAnimationFrame(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      });
    };
    window.addEventListener("resize", affectSize);
    window.addEventListener("orientationchange", affectSize);

    return () => {
      window.removeEventListener("resize", affectSize);
      window.removeEventListener("orientationchange", affectSize);
    };
  }, []);
  return size;
}
