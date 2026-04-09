export function createOvsFilterSimple(
  oversampleRatio: number,
  //cutoffScale: 元のサンプリングレートのFs/2を1.0としたときのカットオフ周波数の比率
  //特に音色を調整する必要がないときは１でよい
  cutoffScale: number,
) {
  const alpha = 1 - Math.exp((-Math.PI * cutoffScale) / oversampleRatio);
  let y1 = 0;
  let y2 = 0;
  let y3 = 0;

  function processSamples(buffer: Float32Array) {
    for (let i = 0; i < buffer.length; i++) {
      const x = buffer[i];
      y1 = (1 - alpha) * y1 + alpha * x;
      y2 = (1 - alpha) * y2 + alpha * y1;
      y3 = (1 - alpha) * y3 + alpha * y2;
      buffer[i] = y3;
    }
  }
  function reset() {
    y1 = 0;
    y2 = 0;
    y3 = 0;
  }
  return { processSamples, reset };
}
