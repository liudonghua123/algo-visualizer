import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TreeNode, TreeStep } from '../algorithms/treeTypes';
import { createRandomBinaryTree, preorderTraversal, inorderTraversal, postorderTraversal } from '../algorithms/treeTraversal';
import './TreeVisualizerPage.css';

interface TreeVisualizerPageProps {
  algorithmId: string;
}

const TreeVisualizerPage: React.FC<TreeVisualizerPageProps> = ({ algorithmId }) => {
  const [tree, setTree] = useState<TreeNode | null>(() => createRandomBinaryTree(3));
  const [currentStep, setCurrentStep] = useState<TreeStep | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);
  const [traversalType, setTraversalType] = useState<'preorder' | 'inorder' | 'postorder'>('inorder');
  const [depth, setDepth] = useState<number>(3);

  const generatorRef = useRef<Generator<TreeStep> | null>(null);
  const animationRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setTree(createRandomBinaryTree(depth));
    setCurrentStep(null);
    setIsRunning(false);
    generatorRef.current = null;
  }, [depth]);

  const runTraversal = useCallback(() => {
    if (!generatorRef.current) {
      switch (traversalType) {
        case 'preorder':
          generatorRef.current = preorderTraversal(tree);
          break;
        case 'inorder':
          generatorRef.current = inorderTraversal(tree);
          break;
        case 'postorder':
          generatorRef.current = postorderTraversal(tree);
          break;
        default:
          return;
      }
    }

    setIsRunning(true);
  }, [tree, traversalType]);

  const stopTraversal = useCallback(() => {
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
        return;
      }

      setCurrentStep(result.value);

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
  }, [isRunning, speed]);

  useEffect(() => {
    reset();
  }, [depth, reset]);

  const renderTree = () => {
    if (!tree) return null;

    const visitedNodes = currentStep?.visitedNodes || [];
    const currentNode = currentStep?.currentNode;

    return (
      <div className="tree-visualization">
        <svg width="100%" height="400" viewBox="0 0 600 400">
          <defs>
            <filter id="treeGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {renderNodes(tree, 300, 40, 0, visitedNodes, currentNode)}
        </svg>
      </div>
    );
  };

  const renderNodes = (
    node: TreeNode | null,
    x: number,
    y: number,
    level: number,
    visitedNodes: number[],
    currentNode?: number
  ) => {
    if (!node) return null;

    const nodeId = (node as any).id || 0;
    const spacing = 250 / Math.pow(2, level);
    const isVisited = visitedNodes.includes(node.value);
    const isCurrent = currentNode === nodeId;

    return (
      <g key={nodeId}>
        {node.left && (
          <>
            <line
              x1={x}
              y1={y + 25}
              x2={x - spacing}
              y2={y + 80}
              stroke={isVisited ? '#10b981' : '#475569'}
              strokeWidth="2"
            />
            {renderNodes(node.left, x - spacing, y + 80, level + 1, visitedNodes, currentNode)}
          </>
        )}
        {node.right && (
          <>
            <line
              x1={x}
              y1={y + 25}
              x2={x + spacing}
              y2={y + 80}
              stroke={isVisited ? '#10b981' : '#475569'}
              strokeWidth="2"
            />
            {renderNodes(node.right, x + spacing, y + 80, level + 1, visitedNodes, currentNode)}
          </>
        )}

        <g transform={`translate(${x}, ${y})`}>
          <circle
            r="25"
            fill={isCurrent ? '#f59e0b' : isVisited ? '#10b981' : '#6366f1'}
            stroke={isCurrent ? '#fbbf24' : isVisited ? '#34d399' : '#818cf8'}
            strokeWidth="3"
            filter={isCurrent ? 'url(#treeGlow)' : undefined}
          />
          <text
            textAnchor="middle"
            dy="6"
            fill="#f1f5f9"
            fontSize="16"
            fontWeight="600"
          >
            {node.value}
          </text>
        </g>
      </g>
    );
  };

  return (
    <div className="tree-page">
      <div className="tree-controls">
        <div className="control-group">
          <label>遍历类型:</label>
          <button
            className={`toggle-btn ${traversalType === 'preorder' ? 'active' : ''}`}
            onClick={() => setTraversalType('preorder')}
            disabled={isRunning}
          >
            前序 (根-左-右)
          </button>
          <button
            className={`toggle-btn ${traversalType === 'inorder' ? 'active' : ''}`}
            onClick={() => setTraversalType('inorder')}
            disabled={isRunning}
          >
            中序 (左-根-右)
          </button>
          <button
            className={`toggle-btn ${traversalType === 'postorder' ? 'active' : ''}`}
            onClick={() => setTraversalType('postorder')}
            disabled={isRunning}
          >
            后序 (左-右-根)
          </button>
        </div>

        <div className="control-group">
          <label>树深度: {depth}</label>
          <input
            type="range"
            min="2"
            max="4"
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
            disabled={isRunning}
          />
        </div>

        <div className="control-group">
          <button
            className="control-btn primary"
            onClick={isRunning ? stopTraversal : runTraversal}
          >
            {isRunning ? '暂停' : '开始遍历'}
          </button>
          <button className="control-btn secondary" onClick={reset}>
            重置树
          </button>
        </div>

        <div className="control-group">
          <label>速度:</label>
          <button
            className={`speed-btn ${speed === 800 ? 'active' : ''}`}
            onClick={() => setSpeed(800)}
          >
            慢
          </button>
          <button
            className={`speed-btn ${speed === 500 ? 'active' : ''}`}
            onClick={() => setSpeed(500)}
          >
            中
          </button>
          <button
            className={`speed-btn ${speed === 200 ? 'active' : ''}`}
            onClick={() => setSpeed(200)}
          >
            快
          </button>
        </div>
      </div>

      {renderTree()}

      {currentStep?.traversal && (
        <div className="traversal-result">
          <div className="result-label">遍历结果:</div>
          <div className="result-sequence">
            {currentStep.traversal.map((value, index) => (
              <span key={index} className="result-item">
                {value}
                {index < currentStep.traversal.length - 1 && <span className="arrow">→</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="message-box">
        <p>{currentStep?.message || '选择遍历类型后点击"开始遍历"'}</p>
      </div>

      <div className="info-box">
        <h4>二叉树遍历说明</h4>
        <div className="traversal-types">
          <div className="traversal-type">
            <strong>前序遍历 (Preorder)</strong>
            <p>顺序: 根节点 → 左子树 → 右子树</p>
          </div>
          <div className="traversal-type">
            <strong>中序遍历 (Inorder)</strong>
            <p>顺序: 左子树 → 根节点 → 右子树</p>
          </div>
          <div className="traversal-type">
            <strong>后序遍历 (Postorder)</strong>
            <p>顺序: 左子树 → 右子树 → 根节点</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeVisualizerPage;
