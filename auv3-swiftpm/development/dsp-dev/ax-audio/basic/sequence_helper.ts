export function calcStepPerSample(bpm: number, sampleRate: number) {
  return (bpm / 60 / sampleRate) * 4;
}

export function calcStepTimeSec(step: number, bpm: number) {
  return (60 / bpm / 4) * step;
}

export function calcNumStepsForSamples(
  bpm: number,
  sampleRate: number,
  sampleCount: number,
) {
  return calcStepPerSample(bpm, sampleRate) * sampleCount;
}

export function calcNumSamplesForSteps(
  bpm: number,
  sampleRate: number,
  steps: number,
) {
  const sps = calcStepPerSample(bpm, sampleRate);
  return steps / sps;
}
