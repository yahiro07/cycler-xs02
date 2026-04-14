import "../../frontend/src";
import { setupDummyParentApp } from "./dummy-parent-app";
import "./tailwind-sources.css";
(window as unknown as { isDebug: boolean }).isDebug =
  location.href.includes("debug=1");
setupDummyParentApp();
