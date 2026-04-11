import { m_cos, m_pi, m_sin } from "@dsp/utils/math-utils";
import { linearInterpolate, mixValue } from "@dsp/utils/number-utils";

type OscWave = "saw" | "rect" | "tri" | "sine";

export function getOscWaveformPd(
  _phase: number,
  wave: OscWave,
  pdLevel: number,
  narrow = false,
): number {
  if (wave === "saw") {
    const sr = 0.5;
    const bp = sr * (1 - pdLevel * 0.95);
    const phaseShift = bp / 2;
    const phase = (_phase + phaseShift) % 1;
    let pp = 0;
    if (phase < bp) {
      const t = phase / bp;
      pp = t * sr;
    } else {
      const t = (phase - bp) / (1 - bp);
      pp = sr + t * (1 - sr);
    }
    if (narrow) {
      return m_sin(pp * m_pi * 2);
    } else {
      return -m_cos(pp * m_pi * 2);
    }
  } else if (wave === "rect") {
    const phase = _phase;
    const phase1 = (phase % 0.5) * 2;
    const bw = pdLevel * 0.45;
    let y = 0;
    if (phase1 < 0.5 - bw) {
      y = (phase1 / (0.5 - bw)) * 0.5;
    } else if (phase1 > 0.5 + bw) {
      y = linearInterpolate(phase1, 0.5 + bw, 1, 0.5, 1);
    } else {
      y = 0.5;
    }
    y *= 0.5;
    const y2 = phase > 0.5 ? 0.5 + y : y;
    if (narrow) {
      return -m_cos(y2 * m_pi * 2);
    } else {
      return m_sin(y2 * m_pi * 2);
    }
  } else if (wave === "tri") {
    const phase = _phase;
    if (0) {
      const phase1 = (phase % 0.5) * 2; //0__1
      const y0 = phase1;
      const y1 = -m_cos(phase1 * m_pi) * 0.5 + 0.5;
      const y = mixValue(y0, y1, pdLevel);
      const y2 = phase > 0.5 ? 0.5 + y * 0.5 : y * 0.5;
      return m_sin(y2 * m_pi * 2);
    } else {
      //PDでうまく三角波が作れないので代替
      let y = 0;
      if (phase < 0.25) {
        y = 4 * phase;
      } else if (phase > 0.75) {
        y = -4 + phase * 4;
      } else {
        y = 2 - 4 * phase;
      }
      const sine = m_sin(phase * m_pi * 2);
      return mixValue(sine, y, pdLevel);
    }
  } else {
    const phase = _phase;
    return m_sin(phase * m_pi * 2);
  }
}
