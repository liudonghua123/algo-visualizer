export interface StackNode {
  value: number;
  highlighted: boolean;
}

export interface QueueNode {
  value: number;
  highlighted: boolean;
}

export interface LinkedListNode {
  value: number;
  next: number | null;
  highlighted: boolean;
}

export type DataStructureType = 'stack' | 'queue' | 'linkedList';

export interface DataStructureStep {
  type: 'push' | 'pop' | 'peek' | 'traverse' | 'insert' | 'delete' | 'search';
  structure: StackNode[] | QueueNode[] | LinkedListNode[];
  highlightedIndices: number[];
  message: string;
}
