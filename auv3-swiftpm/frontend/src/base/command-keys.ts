// export enum ControlCommand {
//   kcSetGroovePlaying = 0, // UI-->App-->DSP
//   kcNoteOn, // App-->UI, APP-->DSP
//   kcNoteOff, // App-->UI, APP-->DSP
//   kcSetBpmToDsp, // App-->DSP
//   kcSetParamVer, // App-->UI, App-->DSP
//   kcSetIsHostedOnDAW, // App-->UI
//   kcSendSP_hostBpm, // App-->UI
//   kcSendSP_standaloneBpm, // App<-->UI, persist
//   kcSendSP_autoRandomizeOnLoop, // App<-->UI, persist
//   kcSendSP_randomizeLevel, // App<-->UI, persist
//   kcSendSP_touchPointerVisible, // App<-->UI, persist
//   kcResetParameters, // UI-->App
//   kcRandomizeParameters, // UI-->App
// }

export type CommandKeyFromApp = "setStandaloneFlag";

export type CommandKeyFromUi =
  | "setPlayState"
  | "resetParameters"
  | "randomizeParameters";
