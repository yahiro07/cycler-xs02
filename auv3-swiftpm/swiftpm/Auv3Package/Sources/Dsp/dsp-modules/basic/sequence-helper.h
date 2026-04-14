#pragma once

namespace dsp {

inline float calcStepPerSample(float bpm, float sampleRate) {
  return (bpm / 60.0f / sampleRate) * 4.0f;
}

inline float calcStepTimeSec(float step, float bpm) {
  return (60.0f / bpm / 4.0f) * step;
}

inline float calcNumStepsForSamples(float bpm, float sampleRate,
                                    int sampleCount) {
  return calcStepPerSample(bpm, sampleRate) * static_cast<float>(sampleCount);
}

inline float calcNumSamplesForSteps(float bpm, float sampleRate, float steps) {
  float sps = calcStepPerSample(bpm, sampleRate);
  return steps / sps;
}

} // namespace dsp
