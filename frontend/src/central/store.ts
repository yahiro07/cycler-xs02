import { createStore } from "snap-store";
import {
  defaultSynthParameters,
  ParameterKey,
  SynthParametersSuit,
} from "@/base/parameters";
import { PresetListItem } from "@/preset-manager/preset-data-types";

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
  //
  presetItems: PresetListItem[];
  latestParametersVersion: number;
  lastLoadedPresetKey: string | null;
  envErrorMessage: string | null;
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
  //
  presetItems: [],
  latestParametersVersion: 0,
  lastLoadedPresetKey: null,
  //
  envErrorMessage: null,
};

export const store = createStore<StoreState>(storeInitialState);
