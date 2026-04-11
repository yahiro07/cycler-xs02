import { ExGaterCode } from "@dsp/base/parameter-defs";
import {
  GaterExNoteType,
  gaterExSeq_buildNotesFromCodesForTest,
} from "@dsp/motions/gaters/gater-ex-seq";
import { describe, expect, it } from "vitest";

describe("gaterExSeq_buildNotesFromCodesForTest", () => {
  it("should return the correct notes", () => {
    {
      const notes = gaterExSeq_buildNotesFromCodesForTest([
        ExGaterCode.one,
        ExGaterCode.one,
        ExGaterCode.one,
        ExGaterCode.one,
      ]);
      expect(notes.length).toBe(4);
      expect(notes.items.slice(0, 4)).toEqual([
        { type: GaterExNoteType.gate, offset: 0, duration: 1 },
        { type: GaterExNoteType.gate, offset: 1, duration: 1 },
        { type: GaterExNoteType.gate, offset: 2, duration: 1 },
        { type: GaterExNoteType.gate, offset: 3, duration: 1 },
      ]);
    }
    {
      const notes = gaterExSeq_buildNotesFromCodesForTest([
        ExGaterCode.one,
        ExGaterCode.double,
        ExGaterCode.one,
        ExGaterCode.tie,
      ]);
      expect(notes.length).toBe(4);
      expect(notes.items.slice(0, 4)).toEqual([
        { type: GaterExNoteType.gate, offset: 0, duration: 1 },
        { type: GaterExNoteType.gate, offset: 1, duration: 0.5 },
        { type: GaterExNoteType.gate, offset: 1.5, duration: 0.5 },
        { type: GaterExNoteType.gate, offset: 2, duration: 2 },
      ]);
    }
    {
      const notes = gaterExSeq_buildNotesFromCodesForTest([
        ExGaterCode.one,
        ExGaterCode.tie,
        ExGaterCode.tie,
        ExGaterCode.tie,
      ]);
      expect(notes.length).toBe(1);
      expect(notes.items.slice(0, 1)).toEqual([
        { type: GaterExNoteType.gate, offset: 0, duration: 4 },
      ]);
    }
  });
});
