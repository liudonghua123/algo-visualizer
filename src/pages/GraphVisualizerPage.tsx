import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import GraphVisualizer from '../components/GraphVisualizer';
import { Graph, GraphNode, GraphEdge, GraphStep } from '../algorithms/graphTypes';
import { createRandomGraph, bfs, dfs, dijkstra } from '../algorithms/graphAlgorithms';
import './GraphVisualizerPage.css';

interface GraphVisualizerPageProps {
  algorithmId: string;
}

const GraphVisualizerPage: React.FC<GraphVisualizerPageProps> = ({ algorithmId }) => {
  const { t } = useTranslation();
  const [graph, setGraph] = useState<Graph>(() => createRandomGraph(8));
  const [currentStep, setCurrentStep] = useState<GraphStep | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);
  const [nodeCount, setNodeCount] = useState<number>(8);

  const generatorRef = useRef<Generator<GraphStep> | null>(null);
  const animationRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    const newGraph = createRandomGraph(nodeCount);
    setGraph(newGraph);
    setCurrentStep(null);
    setMessage(t('graph.message.initial'));
    setIsRunning(false);
    generatorRef.current = null;
  }, [nodeCount, t]);

  const runAlgorithm = useCallback(() => {
    if (!generatorRef.current) {
      switch (algorithmId) {
        case 'bfs':
          generatorRef.current = bfs(graph, 0);
          break;
        case 'dfs':
          generatorRef.current = dfs(graph, 0);
          break;
        case 'dijkstra':
          generatorRef.current = dijkstra(graph, 0);
          break;
        default:
          return;
      }
    }

    setIsRunning(true);
  }, [graph, algorithmId]);

  const stopAlgorithm = useCallback(() => {
    setIsRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isRunning || !generatorRef.current) return;

    const step = () => {
      const result = generatorRef.current!.next();

      if (result.done) {
        setIsRunning(false);
        setMessage(t('graph.message.completed'));
        return;
      }

      setCurrentStep(result.value);
      setMessage(result.value.message || '');

      animationRef.current = requestAnimationFrame(() => {
        setTimeout(step, speed);
      });
    };

    step();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, speed, t]);

  useEffect(() => {
    reset();
  }, [nodeCount, reset]);

  const getDisplayGraph = (): { nodes: GraphNode[]; edges: GraphEdge[] } => {
    const nodes = graph.nodes.map((node) => ({
      ...node,
      visited: currentStep?.visitedNodes?.includes(node.id) || false,
      current: currentStep?.currentNode === node.id,
      inPath: false,
      distance: currentStep?.distances?.get(node.id),
    }));

    const edges = graph.edges.map((edge) => ({
      ...edge,
      current:
        currentStep?.currentEdge?.from === edge.from &&
        currentStep?.currentEdge?.to === edge.to,
      inPath: currentStep?.pathEdges?.some(
        (pe) => pe.from === edge.from && pe.to === edge.to
      ) || false,
    }));

    return { nodes, edges };
  };

  const displayGraph = getDisplayGraph();

  return (
    <div className="graph-page">
      <div className="graph-controls">
        <div className="control-group">
          <button
            className="control-btn primary"
            onClick={isRunning ? stopAlgorithm : runAlgorithm}
          >
            {isRunning ? t('common.pause') : t('graph.start')}
          </button>
          <button className="control-btn secondary" onClick={reset}>
            {t('common.reset')}
          </button>
        </div>

        <div className="control-group">
          <label>{t('graph.nodeCount')}: {nodeCount}</label>
          <input
            type="range"
            min="4"
            max="12"
            value={nodeCount}
            onChange={(e) => setNodeCount(Number(e.target.value))}
            disabled={isRunning}
          />
        </div>

        <div className="control-group">
          <label>{t('common.speed')}:</label>
          <button
            className={`speed-btn ${speed === 800 ? 'active' : ''}`}
            onClick={() => setSpeed(800)}
          >
            {t('common.slow')}
          </button>
          <button
            className={`speed-btn ${speed === 500 ? 'active' : ''}`}
            onClick={() => setSpeed(500)}
          >
            {t('common.medium')}
          </button>
          <button
            className={`speed-btn ${speed === 200 ? 'active' : ''}`}
            onClick={() => setSpeed(200)}
          >
            {t('common.fast')}
          </button>
        </div>
      </div>

      <GraphVisualizer
        nodes={displayGraph.nodes}
        edges={displayGraph.edges}
        distances={currentStep?.distances}
      />

      <div className="message-box">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default GraphVisualizerPage;
