import { actions } from "@/central/actions";
import { setupKeyboardHandlerForTonePreview } from "@/common/keyboard-handler";
import "./bridge/core-bridge";
import { useEffect } from "react";
import { mountAppRoot } from "@/.local/mount-app-root";
import { logger } from "@/bridge/logger";
import { agents } from "@/central/agents";
import { RootPanel } from "@/views/RootPanel";

const App = () => {
  useEffect(() => {
    logger.trace("frontend app mounted");
    agents.setup();
    void agents.initialLoad();
    setupKeyboardHandlerForTonePreview(actions.setPlayState);
  }, []);

  return <RootPanel />;
};

function startApp() {
  mountAppRoot(<App />, "app");
}
startApp();
