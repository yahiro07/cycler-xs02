import { debugEmitError } from "@dsp/base/konsole";
import { ExGaterCode } from "@dsp/base/parameter-defs";
import { Bus } from "@dsp/base/synthesis-bus";
import { getStepPeriodForExGater } from "@dsp/motions/funcs/steps-common";
import { RampSpec } from "@dsp/motions/gaters/ramp-types";
import { seqNumbers } from "@dsp/utils/arrays";

export enum GaterExNoteType {
  off,
  gate,
}

//A note with timing but no pitch
type GaterExNote = {
  type: GaterExNoteType;
  offset: number;
  duration: number; //Relative length to the step
};

type GaterExNotes = {
  items: GaterExNote[]; //8 items allocated
  count: number;
};

type ExGaterCodePacked = number;

type GaterExCacheState = {
  notes: GaterExNotes;
  cacheKeys: {
    codes: ExGaterCodePacked;
  };
};

const gaterExCodeLength = 4;

function createNotesDefault(): GaterExNotes {
  return {
    items: seqNumbers(8).map((i) => ({
      type: GaterExNoteType.gate,
      offset: i,
      duration: 1,
    })),
    count: 0,
  };
}

function createGaterExCacheState(): GaterExCacheState {
  return {
    notes: createNotesDefault(),
    cacheKeys: { codes: -1 },
  };
}

function buildNotesFromCodes(codes: ExGaterCode[], outNotes: GaterExNotes) {
  let outNoteIndex = 0;
  for (let i = 0; i < gaterExCodeLength; i++) {
    const code = codes[i];
    if (code === ExGaterCode.off) {
      const note = outNotes.items[outNoteIndex++];
      note.type = GaterExNoteType.off;
      note.duration = 1;
    } else if (code === ExGaterCode.one) {
      const note = outNotes.items[outNoteIndex++];
      note.type = GaterExNoteType.gate;
      note.duration = 1;
    } else if (code === ExGaterCode.two) {
      for (let i = 0; i < 2; i++) {
        const note = outNotes.items[outNoteIndex++];
        note.type = GaterExNoteType.gate;
        note.duration = 0.5;
      }
    } else if (code === ExGaterCode.tie) {
      const lastNote = outNotes.items[outNoteIndex - 1];
      if (lastNote) {
        lastNote.duration += 1;
      }
    }
  }
  outNotes.count = outNoteIndex;

  let offset = 0;
  for (let i = 0; i < outNotes.count; i++) {
    const note = outNotes.items[i];
    note.offset = offset;
    offset += note.duration;
  }
}

//for test
export function gaterExSeq_buildNotesFromCodesForTest(
  codes: ExGaterCode[],
): GaterExNotes {
  const outNotes = createNotesDefault();
  buildNotesFromCodes(codes, outNotes);
  return outNotes;
}

function packExtGaterCodes(codes: ExGaterCode[]): ExGaterCodePacked {
  let packed = 0;
  for (let i = 0; i < gaterExCodeLength; i++) {
    packed |= (codes[i] & 0x3) << (i * 2);
  }
  return packed;
}

function buildNotesCached(bus: Bus, codes: ExGaterCode[]): GaterExNotes {
  const cacheState = bus.moduleLocals.gaterExSeq as GaterExCacheState;
  const packed = packExtGaterCodes(codes);
  const same = cacheState.cacheKeys.codes === packed;
  if (!same) {
    buildNotesFromCodes(codes, cacheState.notes);
    cacheState.cacheKeys.codes = packed;
  }
  return cacheState.notes;
}

export function gaterExSeqMode_setupLocalState(bus: Bus): void {
  bus.moduleLocals.gaterExSeq ??= createGaterExCacheState();
}
export function gaterExSeqMode_cleanupLocalState(bus: Bus): void {
  bus.moduleLocals.gaterExSeq = undefined;
}

function findNote(notes: GaterExNotes, pos: number): GaterExNote | undefined {
  for (let i = 0; i < notes.count; i++) {
    const note = notes.items[i];
    if (note.offset <= pos && note.offset + note.duration > pos) {
      return note;
    }
  }
  return undefined;
}

export function gaterExSeqMode_getRampSpec(
  bus: Bus,
  stepPos: number,
): RampSpec {
  const sp = bus.parameters;
  const stepPeriod = getStepPeriodForExGater(sp.exGaterSeqStride);
  const scaledStep = stepPos / stepPeriod;
  const basePosition = (scaledStep / 4) >>> 0;
  const pos = scaledStep % 4;
  const notes = buildNotesCached(bus, sp.exGaterCodes);
  // Search for a note at the specified pos in the notes collection, map it to rampSpec, and return it
  const note = findNote(notes, pos);
  if (note) {
    const progress = (pos - note.offset) / note.duration;
    return {
      headPos: (basePosition + note.offset) * stepPeriod,
      relPos: (pos - note.offset) * stepPeriod,
      progress,
      duration: note.duration * stepPeriod,
    };
  } else {
    debugEmitError("note not found");
    return {
      headPos: basePosition * stepPeriod,
      relPos: 0,
      progress: 0,
      duration: stepPeriod,
    };
  }
}
