export interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export interface TreeVisualization {
  nodes: {
    id: number;
    value: number;
    x: number;
    y: number;
    visited: boolean;
    current: boolean;
    highlighted: boolean;
  }[];
  edges: {
    from: number;
    to: number;
    highlighted: boolean;
  }[];
}

export interface TreeStep {
  type: 'visit' | 'explore' | 'complete';
  currentNode?: number;
  visitedNodes?: number[];
  traversal?: number[];
  message: string;
}

export type TraversalType = 'preorder' | 'inorder' | 'postorder';
