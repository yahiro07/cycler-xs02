import { actions } from "@/central/actions";
import { setupKeyboardHandlerForTonePreview } from "@/common/keyboard-handler";
import "./bridge/core-bridge";
import { useEffect } from "react";
import { mountAppRoot } from "@/.local/mount-app-root";
import { logger } from "@/bridge/logger";
import { agents } from "@/central/agents";
import { store } from "@/central/store";
import { setupStorePersistence } from "@/central/store-persistence";
import { RootPanel } from "@/views/RootPanel";
import { windowTyped } from "./bridge/core-bridge";

const App = () => {
  useEffect(() => {
    if (windowTyped.webkit?.messageHandlers.pluginEditor == null) {
      store.mutations.setEnvErrorMessage(
        "cannot setup audio output\nwindow.webkit.messageHandlers.pluginEditor is not defined",
      );
      return;
    }
    logger.trace("frontend app mounted 2049");
    agents.setup();
    setupKeyboardHandlerForTonePreview(actions.setPlayState);
    void (async () => {
      await agents.initialLoad();
      setupStorePersistence();
    })();
  }, []);
  return <RootPanel />;
};

function startApp() {
  mountAppRoot(<App />, "app");
}
startApp();
