export function calcStepTimeSec(step: number, bpm: number) {
  return (60 / bpm / 4) * step;
}
