import React, { useState, useEffect, useRef, useCallback } from 'react';
import BarChart from './BarChart';
import Controls from './Controls';
import StatsDisplay from './StatsDisplay';
import CodeDisplay from './CodeDisplay';
import { AlgorithmName, SortingStep, ALGORITHMS } from '../algorithms/types';
import { bubbleSort } from '../algorithms/bubbleSort';
import { selectionSort } from '../algorithms/selectionSort';
import { insertionSort } from '../algorithms/insertionSort';
import { quickSort } from '../algorithms/quickSort';
import { mergeSort } from '../algorithms/mergeSort';
import { heapSort } from '../algorithms/heapSort';
import { generateRandomArray } from '../utils/generateArray';
import './SortingVisualizer.css';

const algorithmGenerators: Record<AlgorithmName, (arr: number[]) => Generator<SortingStep>> = {
  bubbleSort,
  selectionSort,
  insertionSort,
  quickSort,
  mergeSort,
  heapSort,
};

interface SortingVisualizerProps {
  algorithmId: string;
}

const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ algorithmId }) => {
  const [array, setArray] = useState<number[]>(() => generateRandomArray(30));
  const [algorithm, setAlgorithm] = useState<AlgorithmName>(algorithmId as AlgorithmName);
  const [speed, setSpeed] = useState<number>(200);
  const [arraySize, setArraySize] = useState<number>(30);
  const [sorting, setSorting] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [pivotIndex, setPivotIndex] = useState<number | undefined>(undefined);
  const [comparisons, setComparisons] = useState<number>(0);
  const [swaps, setSwaps] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [codeLanguage, setCodeLanguage] = useState<'python' | 'javascript'>('python');

  const generatorRef = useRef<Generator<SortingStep> | null>(null);
  const sortingRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const maxValue = Math.max(...array);

  useEffect(() => {
    setAlgorithm(algorithmId as AlgorithmName);
    reset();
  }, [algorithmId]);

  const reset = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    sortingRef.current = false;
    setSorting(false);
    setCompleted(false);
    setHighlightedIndices([]);
    setSortedIndices([]);
    setPivotIndex(undefined);
    setComparisons(0);
    setSwaps(0);
    setElapsedTime(0);
    setHighlightedLines([]);
    generatorRef.current = null;
    setArray(generateRandomArray(arraySize));
  }, [arraySize]);

  const handleSizeChange = useCallback((newSize: number) => {
    setArraySize(newSize);
    if (!sorting) {
      reset();
      setArray(generateRandomArray(newSize));
    }
  }, [sorting, reset]);

  const executeStep = useCallback(() => {
    if (!generatorRef.current || !sortingRef.current) return;

    const result = generatorRef.current.next();

    if (result.done) {
      sortingRef.current = false;
      setSorting(false);
      setCompleted(true);
      setHighlightedIndices([]);
      setPivotIndex(undefined);
      setHighlightedLines([]);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const step = result.value;

    switch (step.type) {
      case 'compare':
        setHighlightedIndices(step.indices || []);
        setPivotIndex(undefined);
        if (step.codeLine) {
          setHighlightedLines([step.codeLine]);
        }
        break;

      case 'swap':
        setHighlightedIndices(step.indices || []);
        if (step.array) {
          setArray(step.array);
        }
        setSwaps((prev) => prev + 1);
        if (step.codeLine) {
          setHighlightedLines([step.codeLine]);
        }
        break;

      case 'sorted':
        setHighlightedIndices([]);
        if (step.indices) {
          setSortedIndices((prev) => [...new Set([...prev, ...step.indices!])]);
        }
        if (step.codeLine) {
          setHighlightedLines([step.codeLine]);
        }
        break;

      case 'pivot':
        setPivotIndex(step.pivotIndex);
        if (step.codeLine) {
          setHighlightedLines([step.codeLine]);
        }
        break;

      case 'array':
        if (step.array) {
          setArray(step.array);
        }
        break;
    }

    setComparisons((prev) => prev + 1);

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    setElapsedTime(elapsed);

    animationFrameRef.current = requestAnimationFrame(() => {
      setTimeout(() => {
        executeStep();
      }, speed);
    });
  }, [speed]);

  const play = useCallback(() => {
    if (completed) {
      reset();
      setTimeout(() => play(), 100);
      return;
    }

    if (!generatorRef.current) {
      generatorRef.current = algorithmGenerators[algorithm](array);
      startTimeRef.current = Date.now();
    }

    sortingRef.current = true;
    setSorting(true);
    executeStep();
  }, [algorithm, array, completed, executeStep, reset]);

  const pause = useCallback(() => {
    sortingRef.current = false;
    setSorting(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const step = useCallback(() => {
    if (completed || sorting) return;

    if (!generatorRef.current) {
      generatorRef.current = algorithmGenerators[algorithm](array);
      startTimeRef.current = Date.now();
    }

    const result = generatorRef.current.next();

    if (result.done) {
      setCompleted(true);
      setHighlightedIndices([]);
      setPivotIndex(undefined);
      setHighlightedLines([]);
      return;
    }

    const step = result.value;

    switch (step.type) {
      case 'compare':
        setHighlightedIndices(step.indices || []);
        setPivotIndex(undefined);
        setComparisons((prev) => prev + 1);
        if (step.codeLine) {
          setHighlightedLines([step.codeLine]);
        }
        break;

      case 'swap':
        setHighlightedIndices(step.indices || []);
        if (step.array) {
          setArray(step.array);
        }
        setSwaps((prev) => prev + 1);
        setComparisons((prev) => prev + 1);
        if (step.codeLine) {
          setHighlightedLines([step.codeLine]);
        }
        break;

      case 'sorted':
        setHighlightedIndices([]);
        if (step.indices) {
          setSortedIndices((prev) => [...new Set([...prev, ...step.indices!])]);
        }
        if (step.codeLine) {
          setHighlightedLines([step.codeLine]);
        }
        break;

      case 'pivot':
        setPivotIndex(step.pivotIndex);
        if (step.codeLine) {
          setHighlightedLines([step.codeLine]);
        }
        break;

      case 'array':
        if (step.array) {
          setArray(step.array);
        }
        break;
    }

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    setElapsedTime(elapsed);
  }, [algorithm, array, completed, sorting]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="sorting-visualizer">
      <div className="visualizer-content">
        <div className="visualizer-main">
          <BarChart
            array={array}
            highlightedIndices={highlightedIndices}
            sortedIndices={sortedIndices}
            pivotIndex={pivotIndex}
            maxValue={maxValue}
          />

          <StatsDisplay
            comparisons={comparisons}
            swaps={swaps}
            elapsedTime={elapsedTime}
          />

          <Controls
            sorting={sorting}
            completed={completed}
            algorithm={algorithm}
            speed={speed}
            arraySize={arraySize}
            onPlay={play}
            onPause={pause}
            onReset={reset}
            onStep={step}
            onAlgorithmChange={setAlgorithm}
            onSpeedChange={setSpeed}
            onSizeChange={handleSizeChange}
          />
        </div>

        <div className="visualizer-sidebar">
          <div className="code-language-toggle">
            <button
              className={`language-button ${codeLanguage === 'python' ? 'active' : ''}`}
              onClick={() => setCodeLanguage('python')}
              aria-label="Python代码"
            >
              Python
            </button>
            <button
              className={`language-button ${codeLanguage === 'javascript' ? 'active' : ''}`}
              onClick={() => setCodeLanguage('javascript')}
              aria-label="JavaScript代码"
            >
              JavaScript
            </button>
          </div>

          <CodeDisplay
            algorithm={algorithm}
            highlightedLines={highlightedLines}
            language={codeLanguage}
          />
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;
