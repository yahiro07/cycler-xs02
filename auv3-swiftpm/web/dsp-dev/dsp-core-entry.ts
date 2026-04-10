import { createSynthesizerRoot } from "@core/synthesizer-root";
import type { IDspCore } from "./api";

export type { IDspCore } from "./api";

export function createDspCoreInstance(): IDspCore {
  return createSynthesizerRoot();
}
