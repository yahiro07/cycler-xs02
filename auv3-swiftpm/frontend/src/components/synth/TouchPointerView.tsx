import { css } from "@emotion/react";
import { useEffect, useState } from "react";

export const TouchPointerView = () => {
  const [pt, setPt] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("PointerEvent" in window)) return;

    let activePointerId: number | null = null;

    const onPointerDown = (e: PointerEvent) => {
      if (activePointerId != null) return; // single pointer only
      if (e.pointerType === "pen") return; // pen not needed
      activePointerId = e.pointerId;
      setPt({ x: e.clientX, y: e.clientY });
    };
    const onPointerMove = (e: PointerEvent) => {
      if (activePointerId !== e.pointerId) return;
      setPt({ x: e.clientX, y: e.clientY });
    };
    const onPointerUpOrCancel = (e: PointerEvent) => {
      if (activePointerId !== e.pointerId) return;
      activePointerId = null;
      setPt(null);
    };

    window.addEventListener("pointerdown", onPointerDown, {
      capture: true,
      passive: true,
    });
    window.addEventListener("pointermove", onPointerMove, {
      capture: true,
      passive: true,
    });
    window.addEventListener("pointerup", onPointerUpOrCancel, {
      capture: true,
      passive: true,
    });
    window.addEventListener("pointercancel", onPointerUpOrCancel, {
      capture: true,
      passive: true,
    });

    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointermove", onPointerMove, true);
      window.removeEventListener("pointerup", onPointerUpOrCancel, true);
      window.removeEventListener("pointercancel", onPointerUpOrCancel, true);
    };
  }, []);

  return (
    <div css={styleTouchPointerView.base}>
      {pt && (
        <div
          css={styleTouchPointerView.pointer}
          style={{
            left: pt.x,
            top: pt.y,
          }}
        />
      )}
    </div>
  );
};
const styleTouchPointerView = {
  base: css({
    position: "fixed",
    inset: 0,
    zIndex: 999999,
    pointerEvents: "none",
  }),
  pointer: css({
    position: "absolute",
    width: 48,
    height: 48,
    transform: "translate(-50%, -50%)",
    borderRadius: 9999,
    background: "rgba(255,255,255,0.3)",
    border: "2px solid rgba(255,255,255,0.55)",
    boxShadow: "0 0 0 1px rgba(0,0,0,0.25)",
  }),
};
