#pragma once
#include "../../base/parameter-defs.h"
#include "../../base/synthesis-bus.h"
#include "../funcs/steps-common.h"
#include "./ramp-types.h"

namespace dsp {

enum class GaterExNoteType {
  off,
  gate,
};

struct GaterExNote {
  GaterExNoteType type;
  float offset;
  float duration; // Relative length to the step
};

static constexpr int kGaterExCapacity = 8;
static constexpr int kGaterExCodeLength = 4;

struct GaterExNotes {
  GaterExNote items[kGaterExCapacity];
  int length;
};

using ExGaterCodePacked = int;

struct GaterExCacheState {
  GaterExNotes notes;
  struct {
    ExGaterCodePacked codes;
  } cacheKeys;

  GaterExCacheState() {
    notes.length = 0;
    for (int i = 0; i < kGaterExCapacity; i++) {
      notes.items[i] = {GaterExNoteType::gate, static_cast<float>(i), 1.0f};
    }
    cacheKeys.codes = 0;
  }
};

inline ExGaterCodePacked
packExGaterCodes(const ExGaterCode codes[kGaterExCodeLength]) {
  int packed = 0;
  for (int i = 0; i < kGaterExCodeLength; i++) {
    packed |= static_cast<int>(codes[i]) << (i * 4);
  }
  return packed;
}

inline void buildNotesFromCodes(const ExGaterCode codes[kGaterExCodeLength],
                                GaterExNotes &outNotes) {
  int outNoteIndex = 0;
  for (int i = 0; i < kGaterExCodeLength; i++) {
    const ExGaterCode code = codes[i];
    if (code == ExGaterCode::off) {
      GaterExNote &note = outNotes.items[outNoteIndex++];
      note.type = GaterExNoteType::off;
      note.duration = 1.0f;
    } else if (code == ExGaterCode::one) {
      GaterExNote &note = outNotes.items[outNoteIndex++];
      note.type = GaterExNoteType::gate;
      note.duration = 1.0f;
    } else if (code == ExGaterCode::two) {
      for (int j = 0; j < 2; j++) {
        GaterExNote &note = outNotes.items[outNoteIndex++];
        note.type = GaterExNoteType::gate;
        note.duration = 0.5f;
      }
    } else if (code == ExGaterCode::tie) {
      if (outNoteIndex > 0) {
        outNotes.items[outNoteIndex - 1].duration += 1.0f;
      }
    }
  }
  outNotes.length = outNoteIndex;

  float offset = 0.0f;
  for (int i = 0; i < outNotes.length; i++) {
    GaterExNote &note = outNotes.items[i];
    note.offset = offset;
    offset += note.duration;
  }
}

inline void gaterExSeqMode_setupLocalState(SynthesisBus &bus) {
  if (bus.moduleLocals.gaterExSeq == nullptr) {
    bus.moduleLocals.gaterExSeq = new GaterExCacheState();
  }
}
inline void gaterExSeqMode_cleanupLocalState(SynthesisBus &bus) {
  if (bus.moduleLocals.gaterExSeq) {
    delete static_cast<GaterExCacheState *>(bus.moduleLocals.gaterExSeq);
    bus.moduleLocals.gaterExSeq = nullptr;
  }
}

inline const GaterExNote *findNoteInExSeq(const GaterExNotes &notes,
                                          float pos) {
  for (int i = 0; i < notes.length; i++) {
    const GaterExNote &note = notes.items[i];
    if (note.offset <= pos && note.offset + note.duration > pos) {
      return &note;
    }
  }
  return nullptr;
}

inline RampSpec gaterExSeqMode_getRampSpec(SynthesisBus &bus, float stepPos) {
  const auto &sp = bus.parameters;
  const int stepPeriod = getStepPeriodForExGater(sp.exGaterSeqStride);
  const float stepPeriodF = static_cast<float>(stepPeriod);
  const float scaledStep = stepPos / stepPeriodF;
  const int basePosition = static_cast<int>(scaledStep / 4.0f);
  const float pos = std::fmodf(scaledStep, 4.0f);

  auto &cacheState =
      *static_cast<GaterExCacheState *>(bus.moduleLocals.gaterExSeq);
  const ExGaterCodePacked packed = packExGaterCodes(sp.exGaterCodes);
  if (cacheState.cacheKeys.codes != packed) {
    buildNotesFromCodes(sp.exGaterCodes, cacheState.notes);
    cacheState.cacheKeys.codes = packed;
  }

  const GaterExNote *note = findNoteInExSeq(cacheState.notes, pos);
  if (note) {
    const float progress = (pos - note->offset) / note->duration;
    return RampSpec{
        (static_cast<float>(basePosition) + note->offset) * stepPeriodF,
        (pos - note->offset) * stepPeriodF,
        progress,
        note->duration * stepPeriodF,
    };
  }
  // Fallback (should not happen with valid codes)
  return RampSpec{0.0f, 0.0f, 0.0f, stepPeriodF};
}

} // namespace dsp
