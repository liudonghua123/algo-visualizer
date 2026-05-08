import { Graph, GraphNode, GraphEdge, GraphStep } from './graphTypes';

export function createRandomGraph(nodeCount: number): Graph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const adjacencyList = new Map<number, { node: number; weight: number }[]>();

  const centerX = 300;
  const centerY = 200;
  const radius = 150;

  for (let i = 0; i < nodeCount; i++) {
    const angle = (2 * Math.PI * i) / nodeCount - Math.PI / 2;
    nodes.push({
      id: i,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      label: String.fromCharCode(65 + i),
      visited: false,
      current: false,
      inPath: false,
      distance: Infinity,
    });
    adjacencyList.set(i, []);
  }

  for (let i = 0; i < nodeCount; i++) {
    const nextNode = (i + 1) % nodeCount;
    const weight = Math.floor(Math.random() * 9) + 1;
    edges.push({
      from: i,
      to: nextNode,
      weight,
      inPath: false,
      current: false,
    });
    adjacencyList.get(i)!.push({ node: nextNode, weight });
    adjacencyList.get(nextNode)!.push({ node: i, weight });

    if (Math.random() > 0.5) {
      const randomNode = Math.floor(Math.random() * nodeCount);
      if (randomNode !== i && randomNode !== nextNode) {
        const weight = Math.floor(Math.random() * 9) + 1;
        edges.push({
          from: i,
          to: randomNode,
          weight,
          inPath: false,
          current: false,
        });
        adjacencyList.get(i)!.push({ node: randomNode, weight });
        adjacencyList.get(randomNode)!.push({ node: i, weight });
      }
    }
  }

  return { nodes, edges, adjacencyList };
}

export function* bfs(graph: Graph, startNode: number = 0): Generator<GraphStep> {
  const visited = new Set<number>();
  const queue: number[] = [startNode];
  visited.add(startNode);

  yield {
    type: 'visit',
    currentNode: startNode,
    visitedNodes: Array.from(visited),
    message: `开始BFS，从节点 ${graph.nodes[startNode].label} 出发`,
  };

  while (queue.length > 0) {
    const current = queue.shift()!;

    yield {
      type: 'explore',
      currentNode: current,
      visitedNodes: Array.from(visited),
      message: `访问节点 ${graph.nodes[current].label}`,
    };

    const neighbors = graph.adjacencyList.get(current) || [];
    for (const { node: neighbor } of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);

        yield {
          type: 'visit',
          currentNode: neighbor,
          currentEdge: { from: current, to: neighbor },
          visitedNodes: Array.from(visited),
          message: `发现新节点 ${graph.nodes[neighbor].label}`,
        };
      }
    }
  }

  yield {
    type: 'complete',
    visitedNodes: Array.from(visited),
    message: 'BFS遍历完成',
  };
}

export function* dfs(graph: Graph, startNode: number = 0): Generator<GraphStep> {
  const visited = new Set<number>();
  const stack: number[] = [startNode];

  yield {
    type: 'visit',
    currentNode: startNode,
    visitedNodes: Array.from(visited),
    message: `开始DFS，从节点 ${graph.nodes[startNode].label} 出发`,
  };

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (visited.has(current)) continue;
    visited.add(current);

    yield {
      type: 'explore',
      currentNode: current,
      visitedNodes: Array.from(visited),
      message: `访问节点 ${graph.nodes[current].label}`,
    };

    const neighbors = graph.adjacencyList.get(current) || [];
    for (const { node: neighbor } of [...neighbors].reverse()) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);

        yield {
          type: 'visit',
          currentNode: neighbor,
          currentEdge: { from: current, to: neighbor },
          visitedNodes: Array.from(visited),
          message: `将节点 ${graph.nodes[neighbor].label} 加入栈`,
        };
      }
    }
  }

  yield {
    type: 'complete',
    visitedNodes: Array.from(visited),
    message: 'DFS遍历完成',
  };
}

export function* dijkstra(graph: Graph, startNode: number = 0): Generator<GraphStep> {
  const distances = new Map<number, number>();
  const visited = new Set<number>();
  const previous = new Map<number, number>();

  for (let i = 0; i < graph.nodes.length; i++) {
    distances.set(i, Infinity);
  }
  distances.set(startNode, 0);

  yield {
    type: 'visit',
    currentNode: startNode,
    distances: new Map(distances),
    message: `开始Dijkstra算法，从节点 ${graph.nodes[startNode].label} 出发`,
  };

  while (visited.size < graph.nodes.length) {
    let minDist = Infinity;
    let minNode = -1;

    for (const [node, dist] of distances) {
      if (!visited.has(node) && dist < minDist) {
        minDist = dist;
        minNode = node;
      }
    }

    if (minNode === -1) break;

    visited.add(minNode);

    yield {
      type: 'explore',
      currentNode: minNode,
      visitedNodes: Array.from(visited),
      distances: new Map(distances),
      message: `选择距离最小的节点 ${graph.nodes[minNode].label} (距离: ${minDist})`,
    };

    const neighbors = graph.adjacencyList.get(minNode) || [];
    for (const { node: neighbor, weight } of neighbors) {
      if (!visited.has(neighbor)) {
        const newDist = distances.get(minNode)! + weight;
        if (newDist < distances.get(neighbor)!) {
          distances.set(neighbor, newDist);
          previous.set(neighbor, minNode);

          yield {
            type: 'visit',
            currentNode: neighbor,
            currentEdge: { from: minNode, to: neighbor },
            distances: new Map(distances),
            message: `更新节点 ${graph.nodes[neighbor].label} 的距离: ${newDist}`,
          };
        }
      }
    }
  }

  yield {
    type: 'complete',
    visitedNodes: Array.from(visited),
    distances: new Map(distances),
    message: 'Dijkstra算法完成',
  };
}
