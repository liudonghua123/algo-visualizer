import { SortingStep, SortingAlgorithm } from './types';

export const bubbleSort: SortingAlgorithm = function* (array: number[]) {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: 'compare', indices: [j, j + 1], codeLine: 4 };

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        yield { type: 'swap', indices: [j, j + 1], array: [...arr], codeLine: 6 };
      }
    }

    yield { type: 'sorted', indices: [n - i - 1], codeLine: 3 };

    if (!swapped) {
      for (let k = 0; k < n - i - 1; k++) {
        yield { type: 'sorted', indices: [k] };
      }
      break;
    }
  }

  yield { type: 'sorted', indices: [0], codeLine: 3 };
};
