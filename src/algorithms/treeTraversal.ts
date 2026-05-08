import { TreeNode, TreeStep } from './treeTypes';

let nodeIdCounter = 0;

export function createRandomBinaryTree(depth: number): TreeNode {
  nodeIdCounter = 0;
  return generateTree(depth);
}

function generateTree(depth: number): TreeNode {
  if (depth === 0) {
    return null as any;
  }

  const value = Math.floor(Math.random() * 99) + 1;
  const node: TreeNode = {
    value,
    left: null as any,
    right: null as any,
    ...{ id: nodeIdCounter++ },
  };

  if (depth > 1) {
    node.left = generateTree(depth - 1);
    node.right = generateTree(depth - 1);
  }

  return node;
}

export function* preorderTraversal(root: TreeNode | null): Generator<TreeStep> {
  const visited: number[] = [];

  function* traverse(node: TreeNode | null): Generator<TreeStep> {
    if (!node) return;

    const nodeId = (node as any).id;

    yield {
      type: 'visit',
      currentNode: nodeId,
      visitedNodes: [...visited],
      message: `访问节点 ${node.value}`,
    };

    visited.push(node.value);
    yield {
      type: 'explore',
      currentNode: nodeId,
      visitedNodes: [...visited],
      traversal: [...visited],
      message: `前序: ${visited.join(' → ')}`,
    };

    if (node.left) {
      yield* traverse(node.left);
    }
    if (node.right) {
      yield* traverse(node.right);
    }
  }

  yield* traverse(root);

  yield {
    type: 'complete',
    visitedNodes: [...visited],
    traversal: [...visited],
    message: `前序遍历完成: ${visited.join(' → ')}`,
  };
}

export function* inorderTraversal(root: TreeNode | null): Generator<TreeStep> {
  const visited: number[] = [];

  function* traverse(node: TreeNode | null): Generator<TreeStep> {
    if (!node) return;

    const nodeId = (node as any).id;

    if (node.left) {
      yield* traverse(node.left);
    }

    yield {
      type: 'visit',
      currentNode: nodeId,
      visitedNodes: [...visited],
      message: `访问节点 ${node.value}`,
    };

    visited.push(node.value);
    yield {
      type: 'explore',
      currentNode: nodeId,
      visitedNodes: [...visited],
      traversal: [...visited],
      message: `中序: ${visited.join(' → ')}`,
    };

    if (node.right) {
      yield* traverse(node.right);
    }
  }

  yield* traverse(root);

  yield {
    type: 'complete',
    visitedNodes: [...visited],
    traversal: [...visited],
    message: `中序遍历完成: ${visited.join(' → ')}`,
  };
}

export function* postorderTraversal(root: TreeNode | null): Generator<TreeStep> {
  const visited: number[] = [];

  function* traverse(node: TreeNode | null): Generator<TreeStep> {
    if (!node) return;

    const nodeId = (node as any).id;

    if (node.left) {
      yield* traverse(node.left);
    }
    if (node.right) {
      yield* traverse(node.right);
    }

    yield {
      type: 'visit',
      currentNode: nodeId,
      visitedNodes: [...visited],
      message: `访问节点 ${node.value}`,
    };

    visited.push(node.value);
    yield {
      type: 'explore',
      currentNode: nodeId,
      visitedNodes: [...visited],
      traversal: [...visited],
      message: `后序: ${visited.join(' → ')}`,
    };
  }

  yield* traverse(root);

  yield {
    type: 'complete',
    visitedNodes: [...visited],
    traversal: [...visited],
    message: `后序遍历完成: ${visited.join(' → ')}`,
  };
}

export function treeToVisualization(
  root: TreeNode | null,
  visitedNodes: number[] = [],
  currentNode?: number
): {
  nodes: any[];
  edges: any[];
} {
  const nodes: any[] = [];
  const edges: any[] = [];

  if (!root) {
    return { nodes, edges };
  }

  let nodeIdCounter = 0;

  function traverse(node: TreeNode | null, x: number, y: number, level: number) {
    if (!node) return;

    const id = nodeIdCounter++;
    const spacing = 300 / Math.pow(2, level);

    nodes.push({
      id,
      value: node.value,
      x,
      y,
      visited: visitedNodes.includes(node.value),
      current: currentNode === id,
      highlighted: false,
    });

    if (node.left) {
      edges.push({ from: id, to: nodeIdCounter + countNodes(node.left), highlighted: false });
      traverse(node.left, x - spacing, y + 80, level + 1);
    }

    if (node.right) {
      edges.push({ from: id, to: nodeIdCounter, highlighted: false });
      traverse(node.right, x + spacing, y + 80, level + 1);
    }
  }

  traverse(root, 300, 50, 0);

  return { nodes, edges };
}

function countNodes(node: TreeNode | null): number {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}
