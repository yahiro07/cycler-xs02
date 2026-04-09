import { actions } from "@/central/actions";
import { setupKeyboardHandlerForTonePreview } from "@/common/keyboard-handler";
import "./bridge/core-bridge";
import { mountAppRoot } from "@/.local/mount-app-root";
import { logger } from "@/bridge/logger";
import { RootPanel } from "@/views/RootPanel";

function startApp() {
  logger.trace("----ui startApp----");
  mountAppRoot(<RootPanel />, "app");
  // setupBridgeWiring();
  // setupParamsScheduler();
  setupKeyboardHandlerForTonePreview(actions.setPlayState);
  // setupAutoRandomizeOnLoop();
}

// setTimeout(startApp, 500);
startApp();
