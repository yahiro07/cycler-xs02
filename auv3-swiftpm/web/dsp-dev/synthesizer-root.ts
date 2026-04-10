import { IDspCore } from "@core/api";
import { CommandId } from "@core/parameter-id";
import { ControlCommand } from "./synthesizer/control-command";
import { parameterAssigner_applyParameter } from "./synthesizer/parameter-assigner";
import {
  createSynthesizerHub,
  synthesizerHub_playNote,
  synthesizerHub_prepare,
  synthesizerHub_processSamples,
  synthesizerHub_setBpm,
  synthesizerHub_setGroovePlaying,
  synthesizerHub_setupBlWaveTable,
  synthesizerHub_stopNote,
} from "./synthesizer/synthesizer-hub";

export function createSynthesizerRoot(): IDspCore {
  const synthesizerHub = createSynthesizerHub();
  let playingNoteNumber = -1;
  return {
    prepareProcessing(sampleRate: number, _maxFrames: number): void {
      synthesizerHub_setupBlWaveTable(synthesizerHub);
      synthesizerHub_prepare(synthesizerHub, sampleRate);
    },
    setParameter(id: number, value: number): void {
      parameterAssigner_applyParameter(synthesizerHub.bus.sp, id, value);
    },
    noteOn(noteNumber: number, _velocity: number): void {
      synthesizerHub_playNote(synthesizerHub, noteNumber);
      playingNoteNumber = noteNumber;
    },
    noteOff(noteNumber: number): void {
      if (noteNumber === playingNoteNumber) {
        synthesizerHub_stopNote(synthesizerHub);
        playingNoteNumber = -1;
      }
    },
    processAudio(
      bufferL: Float32Array,
      bufferR: Float32Array,
      frames: number,
    ): void {
      synthesizerHub_processSamples(synthesizerHub, bufferL, frames);
      bufferR.set(bufferL);
    },
    applyCommand(id: number, value: number): void {
      if (id < 0) {
        return;
      }
      if (id === CommandId.setPlayState) {
        synthesizerHub_setGroovePlaying(synthesizerHub, value > 0.5);
      } else if (id === ControlCommand.kcSetBpm) {
        synthesizerHub_setBpm(synthesizerHub, value);
      }
    },
  };
}
