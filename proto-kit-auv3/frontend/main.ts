import { coreBridge } from "./core-bridge";

console.log("frontend");

window.addEventListener("load", () => {
  coreBridge.sendMessage({ type: "uiLoaded" });
});
