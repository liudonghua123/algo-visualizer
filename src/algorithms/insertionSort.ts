import { SortingStep, SortingAlgorithm } from './types';

export const insertionSort: SortingAlgorithm = function* (array: number[]) {
  const arr = [...array];
  const n = arr.length;

  yield { type: 'sorted', indices: [0], codeLine: 2 };

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    yield { type: 'compare', indices: [i, j], codeLine: 5 };

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      yield { type: 'swap', indices: [j, j + 1], array: [...arr], codeLine: 6 };
      j--;
      if (j >= 0) {
        yield { type: 'compare', indices: [i, j], codeLine: 5 };
      }
    }

    arr[j + 1] = key;

    for (let k = 0; k <= i; k++) {
      yield { type: 'sorted', indices: [k], codeLine: 8 };
    }
  }
};
