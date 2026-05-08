import React from 'react';
import { GraphNode, GraphEdge } from '../algorithms/graphTypes';
import './GraphVisualizer.css';

interface GraphVisualizerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  distances?: Map<number, number>;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  nodes,
  edges,
  distances,
}) => {
  const getNodeClassName = (node: GraphNode) => {
    const classes = ['graph-node'];
    if (node.current) classes.push('node-current');
    if (node.visited) classes.push('node-visited');
    if (node.inPath) classes.push('node-path');
    return classes.join(' ');
  };

  const getEdgeClassName = (edge: GraphEdge) => {
    const classes = ['graph-edge'];
    if (edge.current) classes.push('edge-current');
    if (edge.inPath) classes.push('edge-path');
    return classes.join(' ');
  };

  const renderEdge = (edge: GraphEdge) => {
    const fromNode = nodes.find((n) => n.id === edge.from);
    const toNode = nodes.find((n) => n.id === edge.to);
    if (!fromNode || !toNode) return null;

    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    return (
      <g key={`${edge.from}-${edge.to}`}>
        <line
          x1={fromNode.x}
          y1={fromNode.y}
          x2={toNode.x}
          y2={toNode.y}
          className={getEdgeClassName(edge)}
        />
        <text
          x={(fromNode.x + toNode.x) / 2}
          y={(fromNode.y + toNode.y) / 2 - 8}
          className="edge-weight"
          textAnchor="middle"
        >
          {edge.weight}
        </text>
      </g>
    );
  };

  return (
    <div className="graph-visualizer">
      <svg width="100%" height="400" viewBox="0 0 600 400">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="edges">{edges.map(renderEdge)}</g>

        <g className="nodes">
          {nodes.map((node) => (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              <circle
                r="25"
                className={getNodeClassName(node)}
                filter={node.current ? 'url(#glow)' : undefined}
              />
              <text className="node-label" textAnchor="middle" dy="5">
                {node.label}
              </text>
              {distances && distances.get(node.id) !== Infinity && (
                <text className="node-distance" textAnchor="middle" dy="45">
                  d={distances.get(node.id)}
                </text>
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default GraphVisualizer;
