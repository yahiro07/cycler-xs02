import { BassTailAccentPatternKey } from "@core/base/parameter-defs";
import { Bus } from "@core/base/synthesis-bus";
import {
  calcNumStepsForSamples,
  calcStepTimeSec,
} from "@core/dsp-modules/basic/sequence-helper";
import { BassSynth } from "@core/rhythm/bass-synthesizer";
import { KickSynth } from "@core/rhythm/kick-synthesizer";

//a:root, p:+1, g:-2, c:+3
const bassTailAccentPatterns: Record<BassTailAccentPatternKey, string> = {
  [BassTailAccentPatternKey.off]: "_aaa_aaa_aaa_aaa",
  [BassTailAccentPatternKey.pattern1]: "_aaa_aaa_aaa_apa",
  [BassTailAccentPatternKey.pattern2]: "_aaa_aaa_aaa_aap",
  [BassTailAccentPatternKey.pattern3]: "_aaa_aaa_aaa_aag",
  [BassTailAccentPatternKey.pattern4]: "_aaa_aaa_aaa_apg",
};

export class BeatDriver {
  bus: Bus;
  kickSynth: KickSynth;
  bassSynth: BassSynth;
  kickPlaying: boolean;

  constructor(bus: Bus, kickSynth: KickSynth, bassSynth: BassSynth) {
    this.bus = bus;
    this.kickSynth = kickSynth;
    this.bassSynth = bassSynth;
    this.kickPlaying = false;
  }

  onStep(stepIndex: number) {
    const { bus } = this;
    const sp = bus.sp;
    {
      const pos = stepIndex % 4;
      if (pos === 0 && sp.clockingOn && bus.gateOn && sp.kickOn) {
        this.kickSynth.playTone();
        this.kickPlaying = true;
      } else if (pos === 2 && this.kickPlaying) {
        this.kickSynth.stopTone();
        this.kickPlaying = false;
      }
    }
    if (sp.clockingOn && bus.gateOn && sp.bassOn) {
      let pos = stepIndex % 32;
      const targetPattern = bassTailAccentPatterns[sp.bassTailAccentPatternKey];
      let pattern = "";
      if (sp.loopBars === 1) {
        // Loop through the target one bar at a time
        pattern = targetPattern;
        pos %= 16;
      } else {
        // First bar is default pattern, second bar is target pattern
        pattern =
          pos < 16
            ? bassTailAccentPatterns[BassTailAccentPatternKey.off]
            : targetPattern;
        pos %= 16;
      }
      const code = pattern.charAt(pos);
      if (code !== "_") {
        const rel = {
          a: 0,
          p: 1,
          g: -2,
          c: 3,
        }[code];
        if (rel !== undefined) {
          const unitStepSec = calcStepTimeSec(1, bus.bpm);
          const ni = bus.noteNumber - 12 + rel;
          this.bassSynth.playTone(ni, unitStepSec * sp.bassDuty);
        }
      }
    }
  }

  start() {
    this.onStep(0);
  }

  advance() {
    const { bus } = this;
    const sp = bus.sp;
    const { currentStep } = bus;
    const frameStepLength = calcNumStepsForSamples(
      bus.bpm,
      bus.sampleRate,
      bus.blockLength,
    );
    const nextStep = (currentStep + frameStepLength) % (sp.loopBars * 16);
    const s0 = currentStep >>> 0;
    const s1 = nextStep >>> 0;
    if (s1 !== s0) {
      this.onStep(s1);
    }
  }
}
