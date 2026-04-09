import { createStore } from "snap-store";
import {
  defaultSynthParameters,
  ParameterKey,
  SynthParametersSuit,
} from "@/base/parameters";

export type StoreState = SynthParametersSuit & {
  //instant state, emitting
  groovePlaying: boolean;
  editTarget: ParameterKey | null;
  //passive
  isStandalone: boolean;
  hostNoteNumber: number;
  //persist
  touchPointerVisible: boolean;
  //instant state, UI local
  altBottomUi: boolean;
};

const storeInitialState: StoreState = {
  ...defaultSynthParameters,
  groovePlaying: false,
  editTarget: null,
  //
  isStandalone: false,
  hostNoteNumber: -1,
  //
  touchPointerVisible: false,
  //
  altBottomUi: false,
};

export const store = createStore<StoreState>(storeInitialState);
