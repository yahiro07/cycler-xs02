import {
  BassPresetKey,
  BassTailAccentPatternKey,
  DelayStep,
  ExGaterCode,
  GaterExSourceStride,
  GaterSourceStride,
  GaterType,
  GateSequencerCode,
  KickPresetKey,
  LfoWave,
  LoopBarsKey,
  MoEgWave,
  MoId,
  MoRndMode,
  MoType,
  MotionStride,
  OscColorMode,
  OscPitchMode,
  OscUnisonMode,
  RandomizeLevel,
  ShaperMode,
} from "../../frontend/src/base/parameters";
import {
  MessageFromApp,
  MessageFromUi,
} from "../../frontend/src/bridge/message-types";
import { masterGainConfig } from "../../frontend/src/logic/master-gain-config";
import { CommandId, ParameterId } from "../dsp-dev/parameter-id";
import { createDspCoreWorkletWrapper } from "./dsp-dev-support/worklet-wrapper";

const windowTyped = window as unknown as {
  webkit?: {
    messageHandlers: {
      pluginEditor?: {
        postMessage: (msg: string | object) => void;
      };
    };
  };
  pluginEditorCallback?: (msg: MessageFromApp) => void;
};

const workletWrapper = createDspCoreWorkletWrapper();

const PK = ParameterId;

type ParameterDefItem = [number, string, number | boolean];

function motionParameterDefs(
  moId: MoId,
  moTypeDefault: MoType,
): ParameterDefItem[] {
  const _PK = PK as Record<string, number>;
  return [
    [_PK[`${moId}_moOn`], `${moId}_moOn`, false],
    [_PK[`${moId}_moType`], `${moId}_moType`, moTypeDefault],
    [_PK[`${moId}_moAmount`], `${moId}_moAmount`, 0.5],
    [_PK[`${moId}_rndStride`], `${moId}_rndStride`, MotionStride.gate],
    [_PK[`${moId}_rndMode`], `${moId}_rndMode`, MoRndMode.sh],
    [_PK[`${moId}_rndCover`], `${moId}_rndCover`, 1],
    [_PK[`${moId}_lfoWave`], `${moId}_lfoWave`, LfoWave.sine],
    [_PK[`${moId}_lfoRate`], `${moId}_lfoRate`, 0.5],
    [_PK[`${moId}_lfoRateStepped`], `${moId}_lfoRateStepped`, false],
    [_PK[`${moId}_lfoInvert`], `${moId}_lfoInvert`, false],
    [_PK[`${moId}_egStride`], `${moId}_egStride`, MotionStride.gate],
    [_PK[`${moId}_egWave`], `${moId}_egWave`, MoEgWave.d],
    [_PK[`${moId}_egCurve`], `${moId}_egCurve`, 0.5],
    [_PK[`${moId}_egInvert`], `${moId}_egInvert`, false],
  ];
}

const draftParameterDefs: ParameterDefItem[] = [
  [PK.parametersVersion, "parametersVersion", 1],
  //
  [PK.oscOn, "oscOn", true],
  [PK.oscWave, "oscWave", 0],
  [PK.oscOctave, "oscOctave", 0.5],
  [PK.oscPitch, "oscPitch", 0.5],
  [PK.oscPitchMode, "oscPitchMode", OscPitchMode.octave],
  [PK.oscPitchMoSmooth, "oscPitchMoSmooth", 0],
  [PK.oscColor, "oscColor", 0],
  [PK.oscColorMode, "oscColorMode", OscColorMode.sfm],
  [PK.oscUnisonMode, "oscUnisonMode", OscUnisonMode.one],
  [PK.oscUnisonDetune, "oscUnisonDetune", 0],
  //
  [PK.filterOn, "filterOn", true],
  [PK.filterCutoff, "filterCutoff", 1],
  [PK.filterPeak, "filterPeak", 0],
  //
  [PK.ampOn, "ampOn", true],
  [PK.ampEgHold, "ampEgHold", 0.8],
  [PK.ampEgDecay, "ampEgDecay", 0],
  //
  [PK.shaperOn, "shaperOn", false],
  [PK.shaperMode, "shaperMode", ShaperMode.ws1],
  [PK.shaperLevel, "shaperLevel", 0.5],
  //
  [PK.phaserOn, "phaserOn", false],
  [PK.phaserLevel, "phaserLevel", 0.5],
  //
  [PK.delayOn, "delayOn", false],
  [PK.delayTime, "delayTime", 0.5],
  [PK.delayFeed, "delayFeed", 0.3],
  //
  [PK.stepDelayOn, "stepDelayOn", false],
  [PK.stepDelayStep, "stepDelayStep", DelayStep.div8],
  [PK.stepDelayFeed, "stepDelayFeed", 0.5],
  [PK.stepDelayMix, "stepDelayMix", 0.5],
  //
  [PK.gaterStride, "gaterStride", GaterSourceStride.div16],
  [PK.gaterType, "gaterType", GaterType.seq],
  [PK.gaterRndTieOn, "gaterRndTieOn", false],
  [PK.gaterRndTieCover, "gaterRndTieCover", 0.5],
  [PK.exGaterSeqStride, "exGaterSeqStride", GaterExSourceStride.div16],
  [PK.gaterSeqPatterns_0, "gaterSeqPatterns_0", GateSequencerCode.code0],
  [PK.gaterSeqPatterns_1, "gaterSeqPatterns_1", GateSequencerCode.code0],
  [PK.gaterSeqPatterns_2, "gaterSeqPatterns_2", GateSequencerCode.code0],
  [PK.gaterSeqPatterns_3, "gaterSeqPatterns_3", GateSequencerCode.code0],
  [PK.exGaterCodes_0, "exGaterCodes_0", ExGaterCode.one],
  [PK.exGaterCodes_1, "exGaterCodes_1", ExGaterCode.one],
  [PK.exGaterCodes_2, "exGaterCodes_2", ExGaterCode.one],
  [PK.exGaterCodes_3, "exGaterCodes_3", ExGaterCode.one],
  //
  [PK.kickOn, "kickOn", true],
  [PK.kickPresetKey, "kickPresetKey", KickPresetKey.kick1],
  [PK.bassOn, "bassOn", true],
  [PK.bassDuty, "bassDuty", 0.6],
  [PK.bassPresetKey, "bassPresetKey", BassPresetKey.bass1],
  [
    PK.bassTailAccentPatternKey,
    "bassTailAccentPatternKey",
    BassTailAccentPatternKey.off,
  ],
  //
  [PK.kickVolume, "kickVolume", 1],
  [PK.bassVolume, "bassVolume", 1],
  [PK.synthVolume, "synthVolume", 1],
  //
  [PK.loopBars, "loopBars", LoopBarsKey.bar2],
  [PK.looped, "looped", false],
  [PK.masterVolume, "masterVolume", masterGainConfig.levelCenter],
  [PK.clockingOn, "clockingOn", true],
  // [PK.baseOctave, "baseOctave", 3],
  [PK.baseNoteIndex, "baseNoteIndex", 9], //A
  //
  [PK.internalBpm, "internalBpm", 130],
  [PK.autoRandomizeOnLoop, "autoRandomizeOnLoop", false],
  [PK.randomizeLevel, "randomizeLevel", RandomizeLevel.rnd10],
  ...motionParameterDefs("moOscPitch", MoType.rnd),
  ...motionParameterDefs("moOscColor", MoType.eg),
  ...motionParameterDefs("moFilterCutoff", MoType.lfo),
  ...motionParameterDefs("moShaperLevel", MoType.rnd),
  ...motionParameterDefs("moPhaserLevel", MoType.eg),
  ...motionParameterDefs("moDelayTime", MoType.lfo),
];

const parameterKeyToIdMap: Record<string, number> = Object.fromEntries(
  draftParameterDefs.map(([id, key]) => [key, id]),
);

function sendMessageToUi(msg: MessageFromApp) {
  windowTyped.pluginEditorCallback?.(msg);
}

function onMessageFromUi(msg: MessageFromUi) {
  console.log("msg received in dummyParentApp", msg);
  if (msg.type === "uiLoaded") {
    sendMessageToUi({
      type: "applyCommand",
      commandKey: "setStandaloneFlag",
      value: 1,
    });
    const parameters: Record<string, number> = {};
    draftParameterDefs.forEach(([_id, key, value]) => {
      parameters[key] = typeof value === "number" ? value : value ? 1 : 0;
    });
    sendMessageToUi({ type: "bulkSendParameters", parameters });
  } else if (msg.type === "performEdit") {
    const id = parameterKeyToIdMap[msg.paramKey];
    if (id !== undefined) {
      workletWrapper.setParameter(id, msg.value);
    }
  } else if (msg.type === "noteOnRequest") {
    workletWrapper.noteOn(msg.noteNumber, 1);
    sendMessageToUi({ type: "hostNoteOn", noteNumber: msg.noteNumber });
  } else if (msg.type === "noteOffRequest") {
    workletWrapper.noteOff(msg.noteNumber);
    sendMessageToUi({ type: "hostNoteOff", noteNumber: msg.noteNumber });
  } else if (msg.type === "applyCommand") {
    if (msg.commandKey === "setPlayState") {
      workletWrapper.applyCommand(CommandId.setPlayState, msg.value);
    } else if (msg.commandKey === "resetParameters") {
      //reset parameters here
    } else if (msg.commandKey === "randomizeParameters") {
      //randomize parameters here
    }
  }
}

windowTyped.webkit = {
  messageHandlers: {
    pluginEditor: {
      postMessage: (msg: string | object) => {
        onMessageFromUi(msg as MessageFromUi);
      },
    },
  },
};
console.log("dummy parent app initialized");
