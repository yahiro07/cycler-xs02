import { BassTailAccentPatternKey } from "@dsp/base/parameter-defs";
import { Bus } from "@dsp/base/synthesis-bus";
import {
  calcNumStepsForSamples,
  calcStepTimeSec,
} from "@dsp/dsp-modules/basic/sequence-helper";
import { BassSynth } from "@dsp/rhythm/bass-synthesizer";
import { KickSynth } from "@dsp/rhythm/kick-synthesizer";

//a:root, p:+1, g:-2, c:+3
const bassTailAccentPatterns: Record<BassTailAccentPatternKey, string> = {
  [BassTailAccentPatternKey.off]: "_aaa_aaa_aaa_aaa",
  [BassTailAccentPatternKey.pattern1]: "_aaa_aaa_aaa_apa",
  [BassTailAccentPatternKey.pattern2]: "_aaa_aaa_aaa_aap",
  [BassTailAccentPatternKey.pattern3]: "_aaa_aaa_aaa_aag",
  [BassTailAccentPatternKey.pattern4]: "_aaa_aaa_aaa_apg",
};

export class BeatDriver {
  private bus: Bus;
  private kickSynth: KickSynth;
  private bassSynth: BassSynth;
  private kickPlaying: boolean;

  constructor(bus: Bus, kickSynth: KickSynth, bassSynth: BassSynth) {
    this.bus = bus;
    this.kickSynth = kickSynth;
    this.bassSynth = bassSynth;
    this.kickPlaying = false;
  }

  private onStep(stepIndex: number) {
    const sp = this.bus.parameters;
    {
      const pos = stepIndex % 4;
      if (pos === 0 && sp.clockingOn && this.bus.gateOn && sp.kickOn) {
        this.kickSynth.playTone();
        this.kickPlaying = true;
      } else if (pos === 2 && this.kickPlaying) {
        this.kickSynth.stopTone();
        this.kickPlaying = false;
      }
    }
    if (sp.clockingOn && this.bus.gateOn && sp.bassOn) {
      let pos = stepIndex % 32;
      const targetPattern = bassTailAccentPatterns[sp.bassTailAccentPatternKey];
      let pattern = "";
      if (this.bus.loopBars === 1) {
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
          const unitStepSec = calcStepTimeSec(1, this.bus.bpm);
          const ni = this.bus.noteNumber - 12 + rel;
          this.bassSynth.playTone(ni, unitStepSec * sp.bassDuty);
        }
      }
    }
  }

  start() {
    this.onStep(0);
  }

  advance() {
    const { currentStep } = this.bus;
    const frameStepLength = calcNumStepsForSamples(
      this.bus.bpm,
      this.bus.sampleRate,
      this.bus.blockLength,
    );
    const nextStep = (currentStep + frameStepLength) % (this.bus.loopBars * 16);
    const s0 = currentStep >>> 0;
    const s1 = nextStep >>> 0;
    if (s1 !== s0) {
      this.onStep(s1);
    }
  }
}
