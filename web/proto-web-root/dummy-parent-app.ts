import { CommandId, ParameterId } from "@dsp/base/parameter-id";
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
} from "@/base/parameters";
import { createLogger } from "@/bridge/logger";
import { MessageFromApp, MessageFromUi } from "@/bridge/message-types";
import { masterGainConfig } from "@/logic/master-gain-config";
import { createDspCoreWorkletWrapper } from "./dsp-dev-support/worklet-wrapper";
import { LogItem, writeLogItemToConsole } from "./log-emitter";

function createParentSideBridge() {
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

  return {
    sendMessageToUi(msg: MessageFromApp) {
      windowTyped.pluginEditorCallback?.(msg);
    },
    setReceiverForMessageFromUi(receiver: (msg: MessageFromUi) => void) {
      windowTyped.webkit = {
        messageHandlers: {
          pluginEditor: {
            postMessage: (msg: string | object) => {
              receiver(msg as MessageFromUi);
            },
          },
        },
      };
    },
  };
}

const parametersRecordConverter = {
  mapKeysToIds(parameters: Record<string, number>): Record<number, number> {
    const result: Record<number, number> = {};
    for (const [key, value] of Object.entries(parameters)) {
      const id = parameterKeyToIdMap[key];
      if (id !== undefined) {
        result[id] = value;
      }
    }
    return result;
  },
  mapIdsToKeys(parameters: Record<number, number>): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [id, value] of Object.entries(parameters)) {
      const key = parameterIdToKeyMap[Number(id)];
      if (key !== undefined) {
        result[key] = value;
      }
    }
    return result;
  },
};

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

const parameterDefs: ParameterDefItem[] = [
  [PK.parametersVersion, "parametersVersion", 1],
  //
  [PK.oscOn, "oscOn", true],
  [PK.oscWave, "oscWave", 0],
  [PK.oscOctave, "oscOctave", 0],
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
  [PK.randomizeLevel, "randomizeLevel", RandomizeLevel.rnd20],
  ...motionParameterDefs("moOscPitch", MoType.rnd),
  ...motionParameterDefs("moOscColor", MoType.eg),
  ...motionParameterDefs("moFilterCutoff", MoType.lfo),
  ...motionParameterDefs("moShaperLevel", MoType.rnd),
  ...motionParameterDefs("moPhaserLevel", MoType.eg),
  ...motionParameterDefs("moDelayTime", MoType.lfo),
];

const parameterKeyToIdMap: Record<string, number> = Object.fromEntries(
  parameterDefs.map(([id, key]) => [key, id]),
);
const parameterIdToKeyMap: Record<number, string> = Object.fromEntries(
  parameterDefs.map(([id, key]) => [id, key]),
);

function getInitialParameterValues() {
  const parameters: Record<string, number> = {};
  parameterDefs.forEach(([_id, key, value]) => {
    parameters[key] = typeof value === "number" ? value : value ? 1 : 0;
  });
  return parameters;
}

export function setupDummyParentApp() {
  const logger = createLogger("app");

  const { sendMessageToUi, setReceiverForMessageFromUi } =
    createParentSideBridge();
  const workletWrapper = createDspCoreWorkletWrapper();
  const localParameters = getInitialParameterValues();

  let randomizationTaskInitialize = false;

  function emitRandomizationRequest() {
    const params = parametersRecordConverter.mapKeysToIds(localParameters);
    workletWrapper.sendMessage({
      type: "randomizeParameters",
      parameters: params,
    });
  }

  function loadFullParameters(parameters: Record<string, number>) {
    for (const [key, value] of Object.entries(parameters)) {
      const id = parameterKeyToIdMap[key];
      workletWrapper.setParameter(id, value);
    }
    sendMessageToUi({ type: "bulkSendParameters", parameters });
    Object.assign(localParameters, parameters);
  }

  async function onMessageFromUi(msg: MessageFromUi) {
    if (msg.type === "log") {
      writeLogItemToConsole(msg as LogItem);
    } else if (msg.type === "uiLoaded") {
      logger.log("uiLoaded");
      sendMessageToUi({
        type: "applyCommand",
        commandKey: "setStandaloneFlag",
        value: 1,
      });
      const parameters = getInitialParameterValues();
      loadFullParameters(parameters);
    } else if (msg.type === "performEdit") {
      const id = parameterKeyToIdMap[msg.paramKey];
      if (id !== undefined) {
        workletWrapper.setParameter(id, msg.value);
        localParameters[msg.paramKey] = msg.value;
      }
    } else if (msg.type === "noteOnRequest") {
      workletWrapper.noteOn(msg.noteNumber, 1);
      sendMessageToUi({ type: "hostNoteOn", noteNumber: msg.noteNumber });
    } else if (msg.type === "noteOffRequest") {
      workletWrapper.noteOff(msg.noteNumber);
      sendMessageToUi({ type: "hostNoteOff", noteNumber: msg.noteNumber });
    } else if (msg.type === "applyCommand") {
      if (msg.commandKey === "setPlayState") {
        await workletWrapper.resumeIfNeed();
        workletWrapper.applyCommand(CommandId.setPlayState, msg.value);
        if (!randomizationTaskInitialize) {
          startAutoRandomizationTask();
          randomizationTaskInitialize = true;
        }
      } else if (msg.commandKey === "resetParameters") {
        const parameters = getInitialParameterValues();
        const excludingKeys = [
          "parametersVersion",
          "loopBars",
          "looped",
          "masterVolume",
          "clockingOn",
          "baseNoteIndex",
          "internalBpm",
          "autoRandomizeOnLoop",
          "randomizeLevel",
        ];
        excludingKeys.forEach((key) => {
          delete parameters[key];
        });
        loadFullParameters(parameters);
      } else if (msg.commandKey === "randomizeParameters") {
        emitRandomizationRequest();
      }
    }
  }

  function startAutoRandomizationTask() {
    workletWrapper.subscribeMessage((msg) => {
      if (msg.type === "pullRandomizeRequestFlag_response") {
        if (msg.value) {
          emitRandomizationRequest();
        }
      } else if (msg.type === "randomizeParameters_response") {
        const parameters = parametersRecordConverter.mapIdsToKeys(
          msg.parameters,
        );
        loadFullParameters(parameters);
      }
    });
    setInterval(() => {
      workletWrapper.sendMessage({ type: "pullRandomizeRequestFlag" });
    }, 50);
  }

  setReceiverForMessageFromUi(onMessageFromUi);
  logger.trace("dummy parent app initialized");
}
