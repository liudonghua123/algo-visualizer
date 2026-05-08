import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SearchStep } from '../algorithms/searchTypes';
import { linearSearch, binarySearch, generateSortedArray } from '../algorithms/searchAlgorithms';
import './SearchVisualizerPage.css';

interface SearchVisualizerPageProps {
  algorithmId: string;
}

const SearchVisualizerPage: React.FC<SearchVisualizerPageProps> = ({ algorithmId }) => {
  const [array, setArray] = useState<number[]>(() => generateSortedArray(20));
  const [target, setTarget] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<SearchStep | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);
  const [searchType, setSearchType] = useState<'linear' | 'binary'>(
    algorithmId === 'binarySearch' ? 'binary' : 'linear'
  );

  const generatorRef = useRef<Generator<SearchStep> | null>(null);
  const animationRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setArray(generateSortedArray(20));
    setTarget(Math.floor(Math.random() * 100) + 1);
    setCurrentStep(null);
    setIsRunning(false);
    generatorRef.current = null;
  }, []);

  const runSearch = useCallback(() => {
    if (!generatorRef.current) {
      generatorRef.current =
        searchType === 'binary'
          ? binarySearch([...array].sort((a, b) => a - b), target)
          : linearSearch(array, target);
    }

    setIsRunning(true);
  }, [array, target, searchType]);

  const stopSearch = useCallback(() => {
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
  }, [algorithmId, reset]);

  const getArraySize = () => {
    const sortedArray = [...array].sort((a, b) => a - b);
    return sortedArray.length;
  };

  const sortedArray = [...array].sort((a, b) => a - b);

  return (
    <div className="search-page">
      <div className="search-controls">
        <div className="control-group">
          <label>搜索类型:</label>
          <button
            className={`toggle-btn ${searchType === 'linear' ? 'active' : ''}`}
            onClick={() => setSearchType('linear')}
            disabled={isRunning}
          >
            线性查找
          </button>
          <button
            className={`toggle-btn ${searchType === 'binary' ? 'active' : ''}`}
            onClick={() => setSearchType('binary')}
            disabled={isRunning}
          >
            二分查找
          </button>
        </div>

        <div className="control-group">
          <label>目标值: {target}</label>
          <input
            type="range"
            min="1"
            max="200"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            disabled={isRunning}
          />
        </div>

        <div className="control-group">
          <button
            className="control-btn primary"
            onClick={isRunning ? stopSearch : runSearch}
          >
            {isRunning ? '暂停' : '开始搜索'}
          </button>
          <button className="control-btn secondary" onClick={reset}>
            重置
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

      <div className="search-array-container">
        <div className="array-label">数组元素:</div>
        <div className="search-array">
          {sortedArray.map((value, index) => {
            let className = 'search-item';
            if (currentStep?.indices.includes(index)) {
              className += ' comparing';
            }
            if (currentStep?.type === 'found' && currentStep.indices.includes(index)) {
              className += ' found';
            }
            if (searchType === 'binary' && currentStep) {
              if (index >= (currentStep.low || 0) && index <= (currentStep.high || sortedArray.length - 1)) {
                className += ' in-range';
              }
            }

            return (
              <div key={index} className={className}>
                <span className="item-value">{value}</span>
                <span className="item-index">{index}</span>
              </div>
            );
          })}
        </div>
        {searchType === 'binary' && currentStep && (
          <div className="range-indicator">
            <span>low: {currentStep.low}</span>
            <span>mid: {currentStep.low !== undefined && currentStep.high !== undefined 
              ? Math.floor((currentStep.low + currentStep.high) / 2) 
              : '-'}
            </span>
            <span>high: {currentStep.high}</span>
          </div>
        )}
      </div>

      <div className="message-box">
        <p>{currentStep?.message || '设置目标值后点击"开始搜索"'}</p>
      </div>

      {searchType === 'binary' && (
        <div className="info-box">
          <h4>二分查找说明</h4>
          <p>二分查找要求数组有序。每次将搜索范围折半，快速定位目标元素。</p>
          <ul>
            <li>时间复杂度: O(log n)</li>
            <li>空间复杂度: O(1)</li>
            <li>前提条件: 数组必须有序</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchVisualizerPage;
