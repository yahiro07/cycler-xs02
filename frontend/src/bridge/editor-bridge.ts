import { CommandKeyFromUi } from "@/base/command-keys";
import {
  defaultSynthParameters,
  ParameterKey,
  SynthParametersSuit,
} from "@/base/parameters";
import { CoreBridge } from "@/bridge/core-bridge";
import { logger } from "@/bridge/logger";
import { store } from "@/central/store";

type EditorBridge = {
  setup(): () => void;
  requestNoteOn(noteNumber: number): void;
  requestNoteOff(noteNumber: number): void;
  sendCommand(commandKey: CommandKeyFromUi, value: number): void;
};

export function createEditorBridge(coreBridge: CoreBridge): EditorBridge {
  const emitter = {
    sendBeginEdit(paramKey: ParameterKey) {
      coreBridge.sendMessage({ type: "beginEdit", paramKey });
    },
    sendPerformEdit(paramKey: ParameterKey, value: number) {
      coreBridge.sendMessage({ type: "performEdit", paramKey, value });
    },
    sendEndEdit(paramKey: ParameterKey) {
      coreBridge.sendMessage({ type: "endEdit", paramKey });
    },
    sendCommand(commandKey: CommandKeyFromUi, value: number) {
      coreBridge.sendMessage({ type: "applyCommand", commandKey, value });
    },
  };
  function setupReceiver() {
    logger.log("Setting up editor bridge receivers");
    let isReceiving = false;
    const parameterKeys = new Set(Object.keys(defaultSynthParameters));
    let editTargetSent: ParameterKey | undefined;

    //ストアの値を購読して変更があったときに本体に通知する
    const unsubscribeStore = store.subscribe((attrs) => {
      if (isReceiving) return;

      const { editTarget, groovePlaying, ...restAttrs } = attrs;

      if (editTarget !== undefined) {
        if (editTarget !== null) {
          emitter.sendBeginEdit(editTarget);
          editTargetSent = editTarget;
        } else if (editTargetSent) {
          emitter.sendEndEdit(editTargetSent);
          editTargetSent = undefined;
        }
      }
      if (groovePlaying !== undefined) {
        emitter.sendCommand("setPlayState", groovePlaying ? 1 : 0);
      }

      for (const [key, value] of Object.entries(restAttrs)) {
        if (
          parameterKeys.has(key) &&
          (typeof value === "number" || typeof value === "boolean")
        ) {
          const sendingValue =
            typeof value === "boolean" ? (value ? 1 : 0) : value;

          // logger.log("sending parameter change to app", { key, sendingValue });
          coreBridge.sendMessage({
            type: "performEdit",
            paramKey: key,
            value: sendingValue,
          });
        }
      }
    });

    function affectParameterToStore(paramKey: string, value: number) {
      if (parameterKeys.has(paramKey)) {
        const paramType =
          defaultSynthParameters[paramKey as keyof SynthParametersSuit];
        const castedValue =
          typeof paramType === "boolean" ? value >= 0.5 : value;
        store.mutations.assigns({ [paramKey]: castedValue });
      } else {
        logger.warn("unknown parameter key from app:", paramKey);
      }
    }

    const unsubscribeCoreBridge = coreBridge.subscribe((msg) => {
      try {
        //本体からパラメタを受け取ってstoreを更新したときにもsubscribeのコールバックが
        //呼ばれるので、そこで値を送り返さないようにフラグを立てて処理を抑制する
        isReceiving = true;

        // logger.log("message from app", { msg });
        if (msg.type === "setParameter") {
          const { paramKey, value } = msg;
          affectParameterToStore(paramKey, value);
        } else if (msg.type === "bulkSendParameters") {
          for (const [paramKey, value] of Object.entries(msg.parameters)) {
            //store.mutations.*はバッチ化で単一の更新にまとめるので連続で多数呼んでよい
            affectParameterToStore(paramKey, value);
          }
        } else if (msg.type === "hostNoteOn") {
          logger.log(`hostNoteOn: ${msg.noteNumber}`);
          store.mutations.setHostNoteNumber(msg.noteNumber);
        } else if (msg.type === "hostNoteOff") {
          logger.log(`hostNoteOff: ${msg.noteNumber}`);
          if (msg.noteNumber === store.state.hostNoteNumber) {
            store.mutations.setHostNoteNumber(-1);
          }
        } else if (msg.type === "applyCommand") {
          if (msg.commandKey === "setStandaloneFlag") {
            store.mutations.setIsStandalone(true);
          } else if (msg.commandKey === "setHostPlayState") {
            store.mutations.setHostPlayState(msg.value > 0);
          }
        }
        // else if (msg.type === "latestParametersVersion") {
        //   // logger.log(`Received latest parameters version: ${msg.version}`);
        //   store.mutations.setLatestParametersVersion(msg.version);
        // }
      } finally {
        //snap-storeの状態を更新したあと、別タスクでsubscribeのコールバックが呼ばれるので
        //これが終わった後にisReceivingをfalseにする(queueMicrotaskはFIFO順で処理される)
        queueMicrotask(() => {
          isReceiving = false;
        });
      }
    });
    return () => {
      unsubscribeStore();
      unsubscribeCoreBridge();
    };
  }
  function requestNoteOn(noteNumber: number) {
    coreBridge.sendMessage({ type: "noteOnRequest", noteNumber });
  }
  function requestNoteOff(noteNumber: number) {
    coreBridge.sendMessage({ type: "noteOffRequest", noteNumber });
  }
  function sendCommand(commandKey: CommandKeyFromUi, value: number) {
    coreBridge.sendMessage({ type: "applyCommand", commandKey, value });
  }

  return {
    setup: setupReceiver,
    requestNoteOn,
    requestNoteOff,
    sendCommand,
  };
}
