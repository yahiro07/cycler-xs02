#pragma once

namespace dsp {

// Information indicating the intervals and phases of note and parameter changes
// While it generally aligns with step boundaries in 16th-note increments,
// if the step rate is accelerated through a continuous transition,
// the boundary may become a non-integer multiple.

struct RampSpec {
  float headPos;   // Start position of the ramp; offset in steps from the beginning of the loop
  float relPos;    // ramp内でのstep単位での経過時間 0~duration
  float progress;  // Progress within the ramp: 0–1
  float duration;  // Ramp length, in steps
};

enum class StepRampCode {
  one,
  off,
  tie1,
  tie2,
};

} // namespace dsp
