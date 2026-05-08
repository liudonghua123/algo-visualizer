import { SearchStep } from './searchTypes';

export function* linearSearch(array: number[], target: number): Generator<SearchStep> {
  for (let i = 0; i < array.length; i++) {
    yield {
      type: 'compare',
      indices: [i],
      current: i,
      message: `比较第 ${i + 1} 个元素: ${array[i]} 与目标 ${target}`,
    };

    if (array[i] === target) {
      yield {
        type: 'found',
        indices: [i],
        current: i,
        message: `找到目标 ${target} 在位置 ${i}!`,
      };
      return;
    }
  }

  yield {
    type: 'notFound',
    indices: [],
    message: `未找到目标 ${target}`,
  };
}

export function* binarySearch(array: number[], target: number): Generator<SearchStep> {
  let low = 0;
  let high = array.length - 1;

  yield {
    type: 'narrow',
    indices: [low, high],
    low,
    high,
    message: `搜索范围: [${low}, ${high}]`,
  };

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    yield {
      type: 'compare',
      indices: [mid],
      current: mid,
      low,
      high,
      message: `检查中间位置 ${mid}: ${array[mid]}`,
    };

    if (array[mid] === target) {
      yield {
        type: 'found',
        indices: [mid],
        current: mid,
        low,
        high,
        message: `找到目标 ${target} 在位置 ${mid}!`,
      };
      return;
    } else if (array[mid] < target) {
      yield {
        type: 'narrow',
        indices: [mid],
        low: mid + 1,
        high,
        message: `${array[mid]} < ${target}，搜索右半部分`,
      };
      low = mid + 1;
    } else {
      yield {
        type: 'narrow',
        indices: [mid],
        low,
        high: mid - 1,
        message: `${array[mid]} > ${target}，搜索左半部分`,
      };
      high = mid - 1;
    }
  }

  yield {
    type: 'notFound',
    indices: [],
    message: `未找到目标 ${target}`,
  };
}

export function generateSortedArray(size: number, maxValue: number = 100): number[] {
  const arr: number[] = [];
  let current = Math.floor(Math.random() * 10) + 1;

  for (let i = 0; i < size; i++) {
    arr.push(current);
    current += Math.floor(Math.random() * 10) + 1;
  }

  return arr;
}
