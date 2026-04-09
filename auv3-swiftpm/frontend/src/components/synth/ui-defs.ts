import { assignFields } from "@/utils/general-utils";

export const uiSizes = {
  knobMain: 88,
  knobSmall: 78,
  knobXs: 74,
  waveDisplay: 36,
};

export const feColorDefs = {
  // panelBg: "#687494",
  panelBg: "#568",
  panelText: "#fff",
  // sectionBg: "#404450",
  sectionBg: "#383c44",
  buttonBg: "#4c5060",
  knobIndicator: "#0bb",
  ledActive: "#0bb",
  // ledActive: "#3be",
  machineLogo: "#8e0",
};

if (1) {
  assignFields(feColorDefs, {
    // sectionBg: "#585a5c",
    // buttonBg: "#585860",
    buttonBg: "#4c5058",
  });
} else if (0) {
  assignFields(feColorDefs, {
    // sectionBg: "#585a5c",
    buttonBg: "#585860",
  });
}

// export const panelColors = {
//   // boxInner: "#888",
//   panelBody: "#569",
//   text: "#fff",
//   // cyclerLogo: "#1da",
//   cyclerLogo: "#8e0",
// };
