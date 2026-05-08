export interface GraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
  visited: boolean;
  current: boolean;
  inPath: boolean;
  distance?: number;
}

export interface GraphEdge {
  from: number;
  to: number;
  weight: number;
  inPath: boolean;
  current: boolean;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  adjacencyList: Map<number, { node: number; weight: number }[]>;
}

export type GraphAlgorithm = 'bfs' | 'dfs' | 'dijkstra';

export interface GraphStep {
  type: 'visit' | 'explore' | 'path' | 'complete';
  currentNode?: number;
  visitedNodes?: number[];
  currentEdge?: { from: number; to: number };
  pathEdges?: { from: number; to: number }[];
  distances?: Map<number, number>;
  message?: string;
}
