import { ExGaterCode } from "@dsp/base/parameter-defs";
import { RampSpec } from "@dsp/base/ramp-types";
import { Bus } from "@dsp/base/synthesis-bus";
import { getStepPeriodForExGater } from "@dsp/motions/funcs/steps-common";
import { checkArrayItemsEquivalent, seqNumbers } from "@dsp/utils/arrays";
import { raiseError } from "@dsp/utils/errors";

type PreAllocatedArray<T> = {
  reset(): void;
  beginPush(): T;
  endPush(): void;
  at(index: number): T | undefined;
  count: number;
};

function createPreAllocatedArray<T>(
  capacity: number,
  generator: (index: number) => T,
): PreAllocatedArray<T> {
  let length = 0;
  const items: T[] = [];
  for (let i = 0; i < capacity; i++) {
    items.push(generator(i));
  }
  return {
    reset() {
      length = 0;
    },
    get count() {
      return length;
    },
    beginPush() {
      if (length >= items.length) {
        raiseError("PreAllocatedArray is full");
      }
      return items[length];
    },
    endPush() {
      length++;
    },
    at(index) {
      if (index < 0) index = length + index;
      return items[index];
    },
  };
}

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

type GaterExTemporalNote = {
  type: GaterExNoteType;
  duration: number; //Relative length to the step
};

type GaterExNotes = {
  items: GaterExNote[]; //8 items allocated
  length: number;
};

type GaterExCacheState = {
  tmpWorkingNotes: PreAllocatedArray<GaterExTemporalNote>;
  notes: GaterExNotes;
  cacheKeys: {
    codes: ExGaterCode[]; //4 items allocated
  };
};

function createNotesDefault(): GaterExNotes {
  return {
    items: seqNumbers(8).map((i) => ({
      type: GaterExNoteType.gate,
      offset: i,
      duration: 1,
    })),
    length: 0,
  };
}

function createGaterExCacheState(): GaterExCacheState {
  return {
    tmpWorkingNotes: createPreAllocatedArray(8, () => ({
      type: GaterExNoteType.gate,
      duration: 1,
    })),
    notes: createNotesDefault(),
    cacheKeys: { codes: seqNumbers(4).map(() => -1 as ExGaterCode) },
  };
}

function buildNotesFromCodes(
  codes: ExGaterCode[],
  outNotes: GaterExNotes,
  tmpWorkingNotes: PreAllocatedArray<GaterExTemporalNote>,
) {
  tmpWorkingNotes.reset();
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    if (code === ExGaterCode.off) {
      const note = tmpWorkingNotes.beginPush();
      {
        note.type = GaterExNoteType.off;
        note.duration = 1;
      }
      tmpWorkingNotes.endPush();
    } else if (code === ExGaterCode.one) {
      const note = tmpWorkingNotes.beginPush();
      {
        note.type = GaterExNoteType.gate;
        note.duration = 1;
      }
      tmpWorkingNotes.endPush();
    } else if (code === ExGaterCode.double) {
      for (let i = 0; i < 2; i++) {
        const note = tmpWorkingNotes.beginPush();
        {
          note.type = GaterExNoteType.gate;
          note.duration = 0.5;
        }
        tmpWorkingNotes.endPush();
      }
    } else if (code === ExGaterCode.tie) {
      const lastNote = tmpWorkingNotes.at(-1);
      if (lastNote) {
        lastNote.duration += 1;
      }
    }
  }

  let offset = 0;
  for (let i = 0; i < tmpWorkingNotes.count; i++) {
    const note = tmpWorkingNotes.at(i);
    if (!note) continue;
    const outNote = outNotes.items[i];
    {
      outNote.type = note.type;
      outNote.offset = offset;
      outNote.duration = note.duration;
    }
    offset += note.duration;
  }
  outNotes.length = tmpWorkingNotes.count;
}

//for test
export function gaterExSeq_buildNotesFromCodesForTest(
  codes: ExGaterCode[],
): GaterExNotes {
  const outNotes = createNotesDefault();
  const tmpWorkingNotes = createPreAllocatedArray(8, () => ({
    type: GaterExNoteType.gate,
    duration: 1,
  }));
  buildNotesFromCodes(codes, outNotes, tmpWorkingNotes);
  return outNotes;
}

function copyArrayItems<T>(dst: T[], src: T[]) {
  for (let i = 0; i < src.length; i++) {
    dst[i] = src[i];
  }
}

function buildNotesCached(bus: Bus, codes: ExGaterCode[]): GaterExNotes {
  // bus.moduleLocals.gaterExSeq ??= createGaterExCacheState(); //for debug

  const cacheState = bus.moduleLocals.gaterExSeq as GaterExCacheState;
  const same = checkArrayItemsEquivalent(cacheState.cacheKeys.codes, codes);
  if (!same) {
    buildNotesFromCodes(codes, cacheState.notes, cacheState.tmpWorkingNotes);
    copyArrayItems(cacheState.cacheKeys.codes, codes);
  }
  return cacheState.notes;
}

export function gaterExSeqMode_setupLocalState(bus: Bus): void {
  bus.moduleLocals.gaterExSeq ??= createGaterExCacheState();
}

function findNote(notes: GaterExNotes, pos: number): GaterExNote | undefined {
  for (let i = 0; i < notes.length; i++) {
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
  const gp = bus.sp;
  const stepPeriod = getStepPeriodForExGater(gp.exGaterSeqStride);
  const scaledStep = stepPos / stepPeriod;
  const basePosition = (scaledStep / 4) >>> 0;
  const pos = scaledStep % 4;
  const notes = buildNotesCached(bus, gp.exGaterCodes);
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
    raiseError("note not found");
  }
}
