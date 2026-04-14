import { store } from "@/central/store";
import { agents } from "./agents";

export const actions = {
  resetParameters() {
    agents.editorBridge.sendCommand("resetParameters", 1);
  },
  randomizeParameters() {
    agents.editorBridge.sendCommand("randomizeParameters", 1);
  },
  setPlayState(state: boolean) {
    store.mutations.setGroovePlaying(state);
  },
  togglePlayState() {
    store.mutations.toggleGroovePlaying();
  },
};
