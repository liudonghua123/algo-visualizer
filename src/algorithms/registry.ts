export type AlgorithmCategory = 'sorting' | 'graph' | 'datastructure' | 'search' | 'tree';

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  icon: string;
}

export interface CategoryInfo {
  id: AlgorithmCategory;
  name: string;
  description: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'sorting',
    name: '排序算法',
    description: '各种经典排序算法的可视化演示',
    icon: '📊',
  },
  {
    id: 'search',
    name: '查找算法',
    description: '常用搜索算法的可视化演示',
    icon: '🔍',
  },
  {
    id: 'tree',
    name: '树结构',
    description: '二叉树及相关操作的可视化',
    icon: '🌳',
  },
  {
    id: 'graph',
    name: '图算法',
    description: '图遍历和最短路径算法',
    icon: '🕸️',
  },
  {
    id: 'datastructure',
    name: '数据结构',
    description: '基础数据结构的操作演示',
    icon: '📦',
  },
];

export const ALGORITHMS: AlgorithmMeta[] = [
  {
    id: 'bubbleSort',
    name: '冒泡排序',
    category: 'sorting',
    description: '通过相邻元素的比较和交换，将较大的元素逐渐"冒泡"到数组末端',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    icon: '🫧',
  },
  {
    id: 'selectionSort',
    name: '选择排序',
    category: 'sorting',
    description: '在未排序部分中选择最小元素，放到已排序部分的末尾',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    icon: '👆',
  },
  {
    id: 'insertionSort',
    name: '插入排序',
    category: 'sorting',
    description: '将元素插入到已排序部分的正确位置，类似整理扑克牌',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    icon: '📥',
  },
  {
    id: 'quickSort',
    name: '快速排序',
    category: 'sorting',
    description: '选择枢轴元素，将数组分为两部分，递归排序',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    icon: '⚡',
  },
  {
    id: 'mergeSort',
    name: '归并排序',
    category: 'sorting',
    description: '分治策略，将数组递归拆分并合并为有序数组',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    icon: '🔀',
  },
  {
    id: 'heapSort',
    name: '堆排序',
    category: 'sorting',
    description: '利用堆数据结构，先构建最大堆，再逐步提取最大元素',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    icon: '🏔️',
  },
  {
    id: 'binarySearch',
    name: '二分查找',
    category: 'search',
    description: '在有序数组中，通过折半查找快速定位目标元素',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    icon: '🎯',
  },
  {
    id: 'linearSearch',
    name: '线性查找',
    category: 'search',
    description: '顺序遍历数组，逐个比较以找到目标元素',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    icon: '🔎',
  },
  {
    id: 'binaryTree',
    name: '二叉树遍历',
    category: 'tree',
    description: '前序、中序、后序遍历二叉树',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    icon: '🌲',
  },
  {
    id: 'bfs',
    name: '广度优先搜索',
    category: 'graph',
    description: '从起点开始，逐层向外扩展搜索，适合找最短路径',
    timeComplexity: 'O(V+E)',
    spaceComplexity: 'O(V)',
    icon: '🌊',
  },
  {
    id: 'dfs',
    name: '深度优先搜索',
    category: 'graph',
    description: '沿着一条路径深入到底，再回溯探索其他路径',
    timeComplexity: 'O(V+E)',
    spaceComplexity: 'O(V)',
    icon: '🔍',
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra最短路径',
    category: 'graph',
    description: '计算从起点到所有其他节点的最短路径',
    timeComplexity: 'O((V+E) log V)',
    spaceComplexity: 'O(V)',
    icon: '🎯',
  },
  {
    id: 'stack',
    name: '栈',
    category: 'datastructure',
    description: '后进先出(LIFO)的数据结构',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    icon: '📚',
  },
  {
    id: 'queue',
    name: '队列',
    category: 'datastructure',
    description: '先进先出(FIFO)的数据结构',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    icon: '🚶',
  },
  {
    id: 'linkedList',
    name: '链表',
    category: 'datastructure',
    description: '通过指针连接的节点序列',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    icon: '🔗',
  },
];
