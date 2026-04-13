import { SynthesisBus } from "@dsp/base/synthesis-bus";
import { getBufferMaxLevel } from "@dsp/dsp-modules/basic/buffer-functions";

export class SilenceChecker {
  private bus: SynthesisBus;
  private soundActive = false;

  private silentSec = 0;

  constructor(bus: SynthesisBus) {
    this.bus = bus;
  }

  isSoundActive() {
    return this.soundActive;
  }

  wakeUp() {
    this.soundActive = true;
    this.silentSec = 0;
  }

  update(buffer: Float32Array, len: number) {
    if (this.soundActive) {
      const maxLevel = getBufferMaxLevel(buffer, len);
      if (maxLevel < 1e-3) {
        this.silentSec += len / this.bus.sampleRate;
        if (this.silentSec > 3) {
          this.soundActive = false;
        }
      }
    }
  }
}
