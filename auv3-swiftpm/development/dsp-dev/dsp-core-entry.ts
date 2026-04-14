import type { IDspCore } from "./api";
import { SynthesizerRoot } from "./synthesizer-root";

export type { IDspCore } from "./api";

export function createDspCoreInstance(): IDspCore {
  return new SynthesizerRoot();
}
