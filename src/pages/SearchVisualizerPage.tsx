import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import CodeDisplay from '@/components/CodeDisplay';
import { SearchStep } from '../algorithms/searchTypes';
import { linearSearch, binarySearch, generateSortedArray } from '../algorithms/searchAlgorithms';
import './SearchVisualizerPage.css';

interface SearchVisualizerPageProps {
  algorithmId: string;
}

const SearchVisualizerPage: React.FC<SearchVisualizerPageProps> = ({ algorithmId }) => {
  const { t } = useTranslation();
  const [array, setArray] = useState<number[]>(() => generateSortedArray(20));
  const [target, setTarget] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<SearchStep | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);
  const [searchType, setSearchType] = useState<'linear' | 'binary'>(
    algorithmId === 'binarySearch' ? 'binary' : 'linear'
  );
  const [codeLanguage, setCodeLanguage] = useState<'python' | 'javascript'>('python');
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

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
    setHighlightedLines([]);
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

      const stepData = result.value;
      setCurrentStep(stepData);

      if (stepData.type === 'checking') {
        setHighlightedLines([2, 3]);
      } else if (stepData.type === 'found') {
        setHighlightedLines([4]);
      } else if (stepData.type === 'notFound') {
        setHighlightedLines([5]);
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

  const sortedArray = [...array].sort((a, b) => a - b);
  const codeAlgorithmId = searchType === 'binary' ? 'binarySearch' : 'linearSearch';

  return (
    <div className="search-page">
      <div className="search-controls">
        <div className="control-group">
          <label>{t('search.type')}:</label>
          <button
            className={`toggle-btn ${searchType === 'linear' ? 'active' : ''}`}
            onClick={() => setSearchType('linear')}
            disabled={isRunning}
          >
            {t('search.linearSearch.name')}
          </button>
          <button
            className={`toggle-btn ${searchType === 'binary' ? 'active' : ''}`}
            onClick={() => setSearchType('binary')}
            disabled={isRunning}
          >
            {t('search.binarySearch.name')}
          </button>
        </div>

        <div className="control-group">
          <label>{t('common.targetValue')}: {target}</label>
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
            {isRunning ? t('common.pause') : t('search.start')}
          </button>
          <button className="control-btn secondary" onClick={reset}>
            {t('common.reset')}
          </button>
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

      <div className="visualizer-content">
        <div className="visualizer-main">
          <div className="search-array-container">
            <div className="array-label">{t('search.arrayElements')}:</div>
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
            <p>{currentStep?.message || t('search.setTarget')}</p>
          </div>
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
            algorithm={codeAlgorithmId}
            highlightedLines={highlightedLines}
            language={codeLanguage}
          />
        </div>
      </div>

      {searchType === 'binary' && (
        <div className="info-box">
          <h4>{t('search.binarySearch.name')}</h4>
          <p>{t('search.binarySearch.info')}</p>
          <ul>
            <li>{t('common.timeComplexity')}: O(log n)</li>
            <li>{t('common.spaceComplexity')}: O(1)</li>
            <li>{t('search.prerequisite')}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchVisualizerPage;
