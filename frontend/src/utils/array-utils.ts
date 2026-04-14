export function seqNumbers(n: number): number[] {
  return new Array(n).fill(0).map((_, i) => i);
}

export function removeArrayItem<T>(array: T[], item: T) {
  const index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

export function replaceArrayItem<T>(array: T[], index: number, item: T) {
  return array.map((x, idx) => (idx === index ? item : x));
}
