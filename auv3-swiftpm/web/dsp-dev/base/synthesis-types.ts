//ノートやパラメタ変化の区間と位相を表す情報

//概ね16分音符単位のステップ境界に一致するが、ステップを連続変化で加速させたりすると非整数倍の境界になることもある
export type RampSpec = {
  headPos: number; //rampの開始位置, ループ先頭からのステップ単位のオフセット
  relPos: number; //ramp内でのstep単位での経過時間 0~duration
  progress: number; //ramp内での進行度 0~1
  duration: number; //rampの長さ, ステップ単位
};

export enum StepRampCode {
  one,
  off,
  tie1,
  tie2,
}
