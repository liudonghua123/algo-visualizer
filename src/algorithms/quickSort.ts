import { SortingStep, SortingAlgorithm } from './types';

export const quickSort: SortingAlgorithm = function* (array: number[]) {
  const arr = [...array];

  function* partition(low: number, high: number): Generator<SortingStep, number> {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      yield { type: 'compare', indices: [j, high], codeLine: 12 };
      yield { type: 'pivot', pivotIndex: high, codeLine: 9 };

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          yield { type: 'swap', indices: [i, j], array: [...arr], codeLine: 14 };
        }
      }
    }

    if (i + 1 !== high) {
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      yield { type: 'swap', indices: [i + 1, high], array: [...arr], codeLine: 15 };
    }

    yield { type: 'sorted', indices: [i + 1], codeLine: 16 };

    return i + 1;
  }

  function* quickSortRecursive(low: number, high: number): Generator<SortingStep> {
    if (low < high) {
      yield { type: 'compare', indices: [low, high], codeLine: 2 };
      const pi = yield* partition(low, high);
      yield* quickSortRecursive(low, pi - 1);
      yield* quickSortRecursive(pi + 1, high);
    } else if (low === high) {
      yield { type: 'sorted', indices: [low], codeLine: 2 };
    }
  }

  yield* quickSortRecursive(0, arr.length - 1);
};
