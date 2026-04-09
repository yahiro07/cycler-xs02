import { seqNumbers } from "@core/ax/arrays";

const randomSequence = seqNumbers(1000).map(() => Math.random());

export function deterministicRandom(seed: number) {
  if (0) {
    return randomSequence[(seed >>> 0) % randomSequence.length];
  } else {
    const s = Math.floor(seed * 65536) >>> 0;
    let x = Math.imul(s ^ 0x9e3779b9, 2654435761) >>> 0;
    x = (x ^ (x >>> 16)) >>> 0;
    const pos = x % randomSequence.length;
    return randomSequence[pos];
  }
}

export function generateSeedFromText(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = Math.imul(hash ^ text.charCodeAt(i), 2654435761);
  }
  return hash >>> 0;
}
