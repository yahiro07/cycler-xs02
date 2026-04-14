export function seqNumbers(n: number): number[] {
  return new Array(n).fill(0).map((_, i) => i);
}

export function sequenceInRange(lo: number, hi: number): number[] {
  return seqNumbers(hi - lo + 1).map((i) => i + lo);
}

export function removeArrayItem<T>(array: T[], item: T) {
  const index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

export function checkArrayItemsEquivalent<T>(
  array1: T[],
  array2: T[],
): boolean {
  if (array1.length !== array2.length) {
    return false;
  }
  return array1.every((item, index) => item === array2[index]);
}

export function replaceArrayItem<T>(array: T[], index: number, item: T) {
  return array.map((x, idx) => (idx === index ? item : x));
}
