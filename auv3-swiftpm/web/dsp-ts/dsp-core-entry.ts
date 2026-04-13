import { SynthesizerRoot } from "@dsp/synthesizer-root";
import { konsole } from "@dsp/utils/konsole";
import type { IDspCore } from "./base/api";

export type { IDspCore } from "./base/api";

export function createDspCoreInstance(): IDspCore {
  konsole.debugLog("createDspCoreInstance");
  return new SynthesizerRoot();
}
