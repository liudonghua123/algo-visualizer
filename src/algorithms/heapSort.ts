import { SortingStep, SortingAlgorithm } from './types';

export const heapSort: SortingAlgorithm = function* (array: number[]) {
  const arr = [...array];
  const n = arr.length;

  function* heapify(size: number, root: number): Generator<SortingStep> {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      yield { type: 'compare', indices: [left, largest], codeLine: 16 };
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < size) {
      yield { type: 'compare', indices: [right, largest], codeLine: 18 };
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      yield { type: 'swap', indices: [root, largest], array: [...arr], codeLine: 21 };
      yield* heapify(size, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield { type: 'compare', indices: [i], codeLine: 3 };
    yield* heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    yield { type: 'swap', indices: [0, i], array: [...arr], codeLine: 7 };
    yield { type: 'sorted', indices: [i], codeLine: 8 };
    yield* heapify(i, 0);
  }

  yield { type: 'sorted', indices: [0], codeLine: 8 };
};
