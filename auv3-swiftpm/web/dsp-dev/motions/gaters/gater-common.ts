import { RampSpec } from "@core/base/ramp-types";

export type RampSpecBase = {
  headPos: number;
  progress: number;
  duration: number;
  leaping?: boolean;
};

export function emitRampSpec(base: RampSpecBase): RampSpec {
  const headPos = base.headPos;
  const duration = base.duration;
  const relPos = base.progress * duration;
  return {
    headPos,
    relPos,
    progress: base.progress,
    duration,
  };
}
