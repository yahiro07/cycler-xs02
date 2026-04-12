#pragma once
#include "../../base/parameter-defs.h"
#include "../../base/synthesis-bus.h"
#include "../funcs/steps-common.h"
#include "./ramp-types.h"

namespace dsp {

inline StepRampCode getRampCodeFromEx2PatternBits(int patternBits, int index) {
  const int revIndex = 15 - index;
  const int p = (patternBits >> revIndex) & 0b1;
  const int pNext =
      (revIndex > 0) ? ((patternBits >> (revIndex - 1)) & 0b1) : -1;

  if (pNext == 1) {
    return StepRampCode::tie1;
  } else if (p == 1) {
    return StepRampCode::tie2;
  } else {
    return StepRampCode::one;
  }
}

inline int mapCodesToBits(const GateSequencerCode codes[4]) {
  constexpr int ex2PatternMap[6] = {
      // 0 is ON, 1 is tie
      0b0000, // code0 oooo
      0b0001, // code1 ooo>
      0b0010, // code2 oo>o
      0b0100, // code3 o>oo
      0b1000, // code4 >ooo
      0b1001  // code5 >oo>
  };

  int res = 0;
  for (int i = 0; i < 4; i++) {
    const int pattern = ex2PatternMap[static_cast<int>(codes[i])];
    const int shift = (3 - i) * 4;
    res |= pattern << shift;
  }
  return res;
}

inline int getBit(int value, int bitPos) { return (value >> bitPos) & 0b1; }

inline int setBit(int value, int bitPos, int bit) {
  return (value & ~(1 << bitPos)) | (bit << bitPos);
}

inline int replaceContinuousTiesN(int pattern) {
  // If there is a sequence of tie like 011, replace it with 010
  // It is safe to assume that there are no patterns in the input where tie
  // appears three or more times in a row
  for (int i = 0; i < 16; i++) {
    const int p0 = 15 - i;
    const int p1 = 14 - i;
    const int b0 = getBit(pattern, p0);
    const int b1 = getBit(pattern, p1);
    if (b0 == 1 && b1 == 1) {
      pattern = setBit(pattern, p1, 0);
    }
  }
  return pattern;
}

inline StepRampCode gaterMainSeqMode_getRampCode(SynthesisBus &bus,
                                                 float stepPos) {
  const auto &sp = bus.parameters;
  const int stepPeriod = getStepPeriodForGaterMain(sp.gaterStride);
  const float scaledStep = stepPos / stepPeriod;
  const int index = static_cast<int>(scaledStep) % 16;
  int bits = mapCodesToBits(sp.gaterSeqPatterns);
  bits = replaceContinuousTiesN(bits);
  return getRampCodeFromEx2PatternBits(bits, index);
}

} // namespace dsp
