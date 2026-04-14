import { agents } from "@/central/agents";
import { store } from "@/central/store";

type UiPersistState = {
  touchPointerVisible?: boolean;
};

export function setupStorePersistence() {
  const { stateKvs: kvs } = agents;
  const persistKey = "ui-persist-state";
  const text = kvs.read(persistKey);
  if (text) {
    const state: UiPersistState = JSON.parse(text);
    if (state.touchPointerVisible !== undefined) {
      store.mutations.setTouchPointerVisible(state.touchPointerVisible);
    }
  }
  queueMicrotask(() => {
    store.subscribe((attrs) => {
      if (attrs.touchPointerVisible !== undefined) {
        const json = JSON.stringify({
          touchPointerVisible: attrs.touchPointerVisible,
        });
        kvs.write(persistKey, json);
      }
    });
  });
}
