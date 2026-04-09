import { useEffect, useState } from "react";

export function useCheckFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(
    !!document.fullscreenElement,
  );

  useEffect(() => {
    const affectFullscreenState = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    affectFullscreenState();
    document.addEventListener("fullscreenchange", affectFullscreenState);

    return () =>
      document.removeEventListener("fullscreenchange", affectFullscreenState);
  }, []);

  return isFullscreen;
}

export function useFullScreenModel() {
  const isAvailable = document.fullscreenEnabled;
  const isFullscreen = useCheckFullscreen();
  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
  };
  const applyFullscreenState = (nextState: boolean) => {
    if (!isFullscreen && nextState) {
      document.body.requestFullscreen();
    } else if (isFullscreen && !nextState) {
      document.exitFullscreen();
    }
  };
  return { isAvailable, isFullscreen, toggleFullscreen, applyFullscreenState };
}
