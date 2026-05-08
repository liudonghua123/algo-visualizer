export function generateRandomArray(size: number, maxValue: number = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * maxValue) + 1);
}

export function generateNearlySortedArray(size: number, swaps: number = 5): number[] {
  const arr = Array.from({ length: size }, (_, i) => i + 1);

  for (let i = 0; i < swaps; i++) {
    const idx1 = Math.floor(Math.random() * size);
    const idx2 = Math.floor(Math.random() * size);
    [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
  }

  return arr;
}

export function generateReversedArray(size: number): number[] {
  return Array.from({ length: size }, (_, i) => size - i);
}
