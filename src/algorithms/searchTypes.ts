export interface SearchStep {
  type: 'compare' | 'found' | 'notFound' | 'narrow';
  indices: number[];
  current?: number;
  low?: number;
  high?: number;
  message: string;
}

export type SearchAlgorithm = 'linear' | 'binary';
