import { SortingStep, SortingAlgorithm } from './types';

export const selectionSort: SortingAlgorithm = function* (array: number[]) {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', indices: [minIdx, j], codeLine: 6 };

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        yield { type: 'compare', indices: [minIdx], codeLine: 6 };
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield { type: 'swap', indices: [i, minIdx], array: [...arr], codeLine: 7 };
    }

    yield { type: 'sorted', indices: [i], codeLine: 7 };
  }

  yield { type: 'sorted', indices: [n - 1], codeLine: 7 };
};
