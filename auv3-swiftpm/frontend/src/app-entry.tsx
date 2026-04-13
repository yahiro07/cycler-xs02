import { actions } from "@/central/actions";
import { setupKeyboardHandlerForTonePreview } from "@/common/keyboard-handler";
import "./bridge/core-bridge";
import { useEffect } from "react";
import { mountAppRoot } from "@/.local/mount-app-root";
import { logger } from "@/bridge/logger";
import { agents } from "@/central/agents";
import { RootPanel } from "@/views/RootPanel";
import { windowTyped } from "./bridge/core-bridge";
import { store } from "@/central/store";

const App = () => {
  useEffect(() => {
    if (windowTyped.webkit?.messageHandlers.pluginEditor == null) {
      store.mutations.setEnvErrorMessage(
        "cannot setup audio output\nwindow.webkit.messageHandlers.pluginEditor is not defined",
      );
      return;
    }
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
