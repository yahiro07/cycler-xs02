import { useCallback, useState } from "react";
import { startPointerCaptureSession } from "@/utils/pointer-capture-session";

export function usePointerHold() {
  const [hold, setHold] = useState(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    startPointerCaptureSession(e.nativeEvent, {
      capture: false,
      onDown: () => setHold(true),
      onUp: () => setHold(false),
      onCancel: () => setHold(false),
    });
  }, []);

  return {
    hold,
    handlers: { onPointerDown },
  };
}
