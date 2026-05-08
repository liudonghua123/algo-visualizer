import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import CodeDisplay from '@/components/CodeDisplay';
import { TreeNode, TreeStep } from '../algorithms/treeTypes';
import { preorder, inorder, postorder, generateSampleTree } from '../algorithms/treeAlgorithms';
import './TreeVisualizerPage.css';

interface TreeVisualizerPageProps {
  algorithmId: string;
}

const TreeVisualizerPage: React.FC<TreeVisualizerPageProps> = ({ algorithmId }) => {
  const { t } = useTranslation();
  const [tree, setTree] = useState<TreeNode>(() => generateSampleTree());
  const [traversalType, setTraversalType] = useState<'preorder' | 'inorder' | 'postorder'>(
    algorithmId === 'preorder' ? 'preorder' : algorithmId === 'inorder' ? 'inorder' : 'postorder'
  );
  const [currentStep, setCurrentStep] = useState<TreeStep | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(800);
  const [codeLanguage, setCodeLanguage] = useState<'python' | 'javascript'>('python');
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

  const generatorRef = useRef<Generator<TreeStep> | null>(null);
  const animationRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setTree(generateSampleTree());
    setCurrentStep(null);
    setIsRunning(false);
    setHighlightedLines([]);
    generatorRef.current = null;
  }, []);

  const runTraversal = useCallback(() => {
    if (!generatorRef.current) {
      generatorRef.current =
        traversalType === 'preorder'
          ? preorder(tree)
          : traversalType === 'inorder'
          ? inorder(tree)
          : postorder(tree);
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

      const stepData = result.value;
      setCurrentStep(stepData);

      if (stepData.type === 'visit') {
        setHighlightedLines([5]);
      } else if (stepData.type === 'left') {
        setHighlightedLines([6]);
      } else if (stepData.type === 'right') {
        setHighlightedLines([7]);
      } else if (stepData.type === 'base') {
        setHighlightedLines([2, 3]);
      }

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
  }, [algorithmId, reset]);

  const renderNode = (node: TreeNode | null, level: number = 0, position: number = 0): JSX.Element | null => {
    if (!node) return null;

    const isCurrent = currentStep?.currentNode?.val === node.val;
    const isVisited = currentStep?.visitedNodes?.includes(node.val) || false;
    const isInStack = currentStep?.stackNodes?.includes(node.val) || false;

    return (
      <div className="tree-node-wrapper" key={node.val}>
        <div
          className={`tree-node ${isCurrent ? 'current' : ''} ${isVisited ? 'visited' : ''} ${isInStack ? 'in-stack' : ''}`}
        >
          <div className="node-value">{node.val}</div>
        </div>
        {(node.left || node.right) && (
          <div className="tree-children">
            {renderNode(node.left, level + 1, position * 2)}
            {renderNode(node.right, level + 1, position * 2 + 1)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="tree-page">
      <div className="tree-controls">
        <div className="control-group">
          <label>{t('tree.traversalType')}:</label>
          <button
            className={`toggle-btn ${traversalType === 'preorder' ? 'active' : ''}`}
            onClick={() => setTraversalType('preorder')}
            disabled={isRunning}
          >
            {t('tree.preorder.name')}
          </button>
          <button
            className={`toggle-btn ${traversalType === 'inorder' ? 'active' : ''}`}
            onClick={() => setTraversalType('inorder')}
            disabled={isRunning}
          >
            {t('tree.inorder.name')}
          </button>
          <button
            className={`toggle-btn ${traversalType === 'postorder' ? 'active' : ''}`}
            onClick={() => setTraversalType('postorder')}
            disabled={isRunning}
          >
            {t('tree.postorder.name')}
          </button>
        </div>

        <div className="control-group">
          <button
            className="control-btn primary"
            onClick={isRunning ? stopTraversal : runTraversal}
          >
            {isRunning ? t('common.pause') : t('tree.start')}
          </button>
          <button className="control-btn secondary" onClick={reset}>
            {t('common.reset')}
          </button>
        </div>

        <div className="control-group">
          <label>{t('common.speed')}:</label>
          <button
            className={`speed-btn ${speed === 1200 ? 'active' : ''}`}
            onClick={() => setSpeed(1200)}
          >
            {t('common.slow')}
          </button>
          <button
            className={`speed-btn ${speed === 800 ? 'active' : ''}`}
            onClick={() => setSpeed(800)}
          >
            {t('common.medium')}
          </button>
          <button
            className={`speed-btn ${speed === 400 ? 'active' : ''}`}
            onClick={() => setSpeed(400)}
          >
            {t('common.fast')}
          </button>
        </div>
      </div>

      <div className="visualizer-content">
        <div className="visualizer-main">
          <div className="tree-container">
            <div className="tree-visualization">
              {renderNode(tree)}
            </div>
          </div>

          <div className="message-box">
            <p>{currentStep?.message || t('tree.setTarget')}</p>
          </div>

          {currentStep?.result && (
            <div className="result-box">
              <h4>{t('tree.result')}:</h4>
              <div className="result-sequence">
                {currentStep.result.map((val, idx) => (
                  <span key={idx} className="result-item">{val}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="visualizer-sidebar">
          <div className="code-language-toggle">
            <button
              className={`language-button ${codeLanguage === 'python' ? 'active' : ''}`}
              onClick={() => setCodeLanguage('python')}
            >
              Python
            </button>
            <button
              className={`language-button ${codeLanguage === 'javascript' ? 'active' : ''}`}
              onClick={() => setCodeLanguage('javascript')}
            >
              JavaScript
            </button>
          </div>

          <CodeDisplay
            algorithm={traversalType}
            highlightedLines={highlightedLines}
            language={codeLanguage}
          />
        </div>
      </div>
    </div>
  );
};

export default TreeVisualizerPage;
