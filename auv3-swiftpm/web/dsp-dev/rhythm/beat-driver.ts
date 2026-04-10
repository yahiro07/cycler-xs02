import {
  calcNumStepsForSamples,
  calcStepTimeSec,
} from "@core/ax-audio/basic/sequence-helper";
import { BassTailAccentPatternKey } from "@core/base/parameter-defs";
import { Bus } from "@core/base/synthesis-bus";
import { BassSynth, bassSynth_playTone } from "@core/rhythm/bass-synthesizer";
import {
  KickSynth,
  kickSynth_playTone,
  kickSynth_stopTone,
} from "@core/rhythm/kick-synthesizer";

export type BeatDriver = {
  bus: Bus;
  kickSynth: KickSynth;
  bassSynth: BassSynth;
  kickPlaying: boolean;
};

export function createBeatDriver(
  bus: Bus,
  kickSynth: KickSynth,
  bassSynth: BassSynth,
): BeatDriver {
  return {
    bus,
    kickSynth,
    bassSynth,
    kickPlaying: false,
  };
}

//a:root, p:+1, g:-2, c:+3
const bassTailAccentPatterns: Record<BassTailAccentPatternKey, string> = {
  [BassTailAccentPatternKey.off]: "_aaa_aaa_aaa_aaa",
  [BassTailAccentPatternKey.pattern1]: "_aaa_aaa_aaa_apa",
  [BassTailAccentPatternKey.pattern2]: "_aaa_aaa_aaa_aap",
  [BassTailAccentPatternKey.pattern3]: "_aaa_aaa_aaa_aag",
  [BassTailAccentPatternKey.pattern4]: "_aaa_aaa_aaa_apg",
};

function beatDriver_onStep(self: BeatDriver, stepIndex: number) {
  const { bus, kickSynth, bassSynth } = self;
  const sp = self.bus.sp;
  {
    const pos = stepIndex % 4;
    if (pos === 0 && sp.clockingOn && bus.gateOn && sp.kickOn) {
      kickSynth_playTone(kickSynth);
      self.kickPlaying = true;
    } else if (pos === 2 && self.kickPlaying) {
      kickSynth_stopTone(kickSynth);
      self.kickPlaying = false;
    }
  }
  if (sp.clockingOn && bus.gateOn && sp.bassOn) {
    let pos = stepIndex % 32;
    const targetPattern = bassTailAccentPatterns[sp.bassTailAccentPatternKey];
    let pattern = "";
    if (sp.loopBars === 1) {
      //targetを1小節単位でループ
      pattern = targetPattern;
      pos %= 16;
    } else {
      //一小節目はデフォルトパターン、2小節目は対象パターン
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
        bassSynth_playTone(bassSynth, ni, unitStepSec * sp.bassDuty);
      }
    }
  }
}

export function beatDriver_start(self: BeatDriver) {
  beatDriver_onStep(self, 0);
}

export function beatDriver_advance(self: BeatDriver) {
  const { bus } = self;
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
    beatDriver_onStep(self, s1);
  }
}
