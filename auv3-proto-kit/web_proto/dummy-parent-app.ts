import { DspCore, ParameterId } from "../dsp_proto/main";

type MessageFromUi =
  | { type: "uiLoaded" }
  | { type: "beginEdit"; paramKey: string }
  | { type: "performEdit"; paramKey: string; value: number }
  | { type: "endEdit"; paramKey: string }
  | { type: "instantEdit"; paramKey: string; value: number }
  | { type: "noteOnRequest"; noteNumber: number }
  | { type: "noteOffRequest"; noteNumber: number };

type MessageFromApp =
  | { type: "setParameter"; paramKey: string; value: number }
  | { type: "bulkSendParameters"; parameters: Record<string, number> }
  | { type: "hostNoteOn"; noteNumber: number }
  | { type: "hostNoteOff"; noteNumber: number };

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


//TODO: wrap with AudioWorklet
const dspCore = new DspCore();

const draftParameterDefs: [number, string, number | boolean][] = [
  [ParameterId.oscEnabled, "oscEnabled", true],
  [ParameterId.oscWave, "oscWave", 0],
  [ParameterId.oscPitch, "oscPitch", 0.5],
  [ParameterId.oscVolume, "oscVolume", 0.5],
];
const parameterKeyToIdMap: Record<string, ParameterId> = Object.fromEntries(
  draftParameterDefs.map(([id, key]) => [key, id]),
);

function sendMessageToUi(msg: MessageFromApp) {
  windowTyped.pluginEditorCallback?.(msg);
}

function onMessageFromUi(msg: MessageFromUi) {
  console.log("msg received in dummyParentApp", msg);
  if (msg.type === "uiLoaded") {
    const parameters: Record<string, number> = {};
    draftParameterDefs.forEach(([id, key, value]) => {
      parameters[key] = typeof value === "number" ? value : value ? 1 : 0;
    });
    sendMessageToUi({ type: "bulkSendParameters", parameters });
  } else if (msg.type === "performEdit") {
    const id = parameterKeyToIdMap[msg.paramKey];
    if (id !== undefined) {
      dspCore.setParameter(id, msg.value);
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
