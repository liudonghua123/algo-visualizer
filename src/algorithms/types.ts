export interface SortingStep {
  type: 'compare' | 'swap' | 'sorted' | 'pivot';
  indices?: number[];
  array?: number[];
  pivotIndex?: number;
  codeLine?: number;
}

export type SortingAlgorithm = (array: number[]) => Generator<SortingStep>;

export type AlgorithmName =
  | 'bubbleSort'
  | 'selectionSort'
  | 'insertionSort'
  | 'quickSort'
  | 'mergeSort'
  | 'heapSort';

export interface AlgorithmInfo {
  name: string;
  displayName: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export const ALGORITHMS: Record<AlgorithmName, AlgorithmInfo> = {
  bubbleSort: {
    name: 'bubbleSort',
    displayName: '冒泡排序',
    description: '通过相邻元素的比较和交换，将较大的元素逐渐"冒泡"到数组末端',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
  },
  selectionSort: {
    name: 'selectionSort',
    displayName: '选择排序',
    description: '在未排序部分中选择最小元素，放到已排序部分的末尾',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
  },
  insertionSort: {
    name: 'insertionSort',
    displayName: '插入排序',
    description: '将元素插入到已排序部分的正确位置，类似整理扑克牌',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
  },
  quickSort: {
    name: 'quickSort',
    displayName: '快速排序',
    description: '选择枢轴元素，将数组分为两部分，递归排序',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
  },
  mergeSort: {
    name: 'mergeSort',
    displayName: '归并排序',
    description: '分治策略，将数组递归拆分并合并为有序数组',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
  },
  heapSort: {
    name: 'heapSort',
    displayName: '堆排序',
    description: '利用堆数据结构，先构建最大堆，再逐步提取最大元素',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
  },
};
