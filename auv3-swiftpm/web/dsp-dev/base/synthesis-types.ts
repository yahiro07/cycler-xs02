// Information indicating the intervals and phases of note and parameter changes

//While it generally aligns with step boundaries in 16th-note increments,
//if the step rate is accelerated through a continuous transition,
//the boundary may become a non-integer multiple.

export type RampSpec = {
  headPos: number; //Start position of the ramp; offset in steps from the beginning of the loop
  relPos: number; //ramp内でのstep単位での経過時間 0~duration
  progress: number; //Progress within the ramp: 0–1
  duration: number; //Ramp length, in steps
};

export enum StepRampCode {
  one,
  off,
  tie1,
  tie2,
}
