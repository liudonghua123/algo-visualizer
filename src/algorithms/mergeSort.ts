import { SortingStep, SortingAlgorithm } from './types';

export const mergeSort: SortingAlgorithm = function* (array: number[]) {
  const arr = [...array];

  function* merge(left: number, mid: number, right: number): Generator<SortingStep> {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      yield { type: 'compare', indices: [left + i, mid + 1 + j], codeLine: 13 };

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
        yield { type: 'swap', indices: [k], array: [...arr], codeLine: 15 };
      } else {
        arr[k] = rightArr[j];
        j++;
        yield { type: 'swap', indices: [k], array: [...arr], codeLine: 17 };
      }
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      yield { type: 'swap', indices: [k], array: [...arr], codeLine: 15 };
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      yield { type: 'swap', indices: [k], array: [...arr], codeLine: 17 };
      j++;
      k++;
    }

    for (let idx = left; idx <= right; idx++) {
      yield { type: 'sorted', indices: [idx], codeLine: 8 };
    }
  }

  function* mergeSortRecursive(left: number, right: number): Generator<SortingStep> {
    if (left < right) {
      yield { type: 'compare', indices: [left, right], codeLine: 2 };
      const mid = Math.floor((left + right) / 2);

      yield* mergeSortRecursive(left, mid);
      yield* mergeSortRecursive(mid + 1, right);
      yield* merge(left, mid, right);
    }
  }

  yield* mergeSortRecursive(0, arr.length - 1);
};
