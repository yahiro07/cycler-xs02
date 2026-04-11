import { SynthesizerRoot } from "@core/synthesizer-root";
import type { IDspCore } from "./base/api";

export type { IDspCore } from "./base/api";

export function createDspCoreInstance(): IDspCore {
  return new SynthesizerRoot();
}
