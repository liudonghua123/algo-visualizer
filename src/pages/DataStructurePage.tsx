import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DataStructureVisualizer from '../components/DataStructureVisualizer';
import { StackNode, QueueNode, LinkedListNode, DataStructureStep } from '../algorithms/dataStructureTypes';
import { stackOperations, queueOperations, linkedListOperations } from '../algorithms/dataStructureOperations';
import './DataStructurePage.css';

interface DataStructurePageProps {
  algorithmId: string;
}

const DataStructurePage: React.FC<DataStructurePageProps> = ({ algorithmId }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<StackNode[] | QueueNode[] | LinkedListNode[]>([]);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [positionValue, setPositionValue] = useState<string>('');
  const [operations, setOperations] = useState<string[]>([]);
  const [speed, setSpeed] = useState<number>(500);

  const generatorRef = useRef<Generator<DataStructureStep> | null>(null);
  const animationRef = useRef<number | null>(null);

  const getType = (): 'stack' | 'queue' | 'linkedList' => {
    switch (algorithmId) {
      case 'stack':
        return 'stack';
      case 'queue':
        return 'queue';
      case 'linkedList':
        return 'linkedList';
      default:
        return 'stack';
    }
  };

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setData([]);
    setHighlightedIndices([]);
    setMessage(t('datastructure.message.initial'));
    setIsRunning(false);
    setOperations([]);
    generatorRef.current = null;
  }, [t]);

  const addOperation = (op: string) => {
    setOperations((prev) => [...prev, op]);
  };

  const runOperations = useCallback(() => {
    if (operations.length === 0) {
      setMessage(t('datastructure.message.noOperations'));
      return;
    }

    switch (algorithmId) {
      case 'stack':
        generatorRef.current = stackOperations(operations);
        break;
      case 'queue':
        generatorRef.current = queueOperations(operations);
        break;
      case 'linkedList':
        generatorRef.current = linkedListOperations(operations);
        break;
      default:
        return;
    }

    setIsRunning(true);
  }, [operations, algorithmId, t]);

  const stopExecution = useCallback(() => {
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

      setData(result.value.structure);
      setHighlightedIndices(result.value.highlightedIndices);
      setMessage(result.value.message);

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

  const renderControls = () => {
    switch (algorithmId) {
      case 'stack':
        return (
          <>
            <div className="input-group">
              <input
                type="number"
                placeholder={t('common.inputValue')}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isRunning}
              />
              <button
                className="action-btn"
                onClick={() => {
                  if (inputValue) {
                    addOperation(`push ${inputValue}`);
                    setInputValue('');
                  }
                }}
                disabled={isRunning}
              >
                {t('common.push')}
              </button>
            </div>
            <button
              className="action-btn secondary"
              onClick={() => addOperation('pop')}
              disabled={isRunning}
            >
              {t('common.pop')}
            </button>
            <button
              className="action-btn secondary"
              onClick={() => addOperation('peek')}
              disabled={isRunning}
            >
              {t('datastructure.stack.peek')}
            </button>
          </>
        );
      case 'queue':
        return (
          <>
            <div className="input-group">
              <input
                type="number"
                placeholder={t('common.inputValue')}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isRunning}
              />
              <button
                className="action-btn"
                onClick={() => {
                  if (inputValue) {
                    addOperation(`enqueue ${inputValue}`);
                    setInputValue('');
                  }
                }}
                disabled={isRunning}
              >
                {t('common.enqueue')}
              </button>
            </div>
            <button
              className="action-btn secondary"
              onClick={() => addOperation('dequeue')}
              disabled={isRunning}
            >
              {t('common.dequeue')}
            </button>
            <button
              className="action-btn secondary"
              onClick={() => addOperation('peek')}
              disabled={isRunning}
            >
              {t('datastructure.queue.front')}
            </button>
          </>
        );
      case 'linkedList':
        return (
          <>
            <div className="input-group">
              <input
                type="number"
                placeholder={t('common.inputValue')}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isRunning}
              />
              <input
                type="number"
                placeholder={t('datastructure.linkedList.position')}
                value={positionValue}
                onChange={(e) => setPositionValue(e.target.value)}
                disabled={isRunning}
              />
              <button
                className="action-btn"
                onClick={() => {
                  if (inputValue) {
                    addOperation(positionValue ? `insert ${inputValue} ${positionValue}` : `insert ${inputValue}`);
                    setInputValue('');
                    setPositionValue('');
                  }
                }}
                disabled={isRunning}
              >
                {t('common.insert')}
              </button>
            </div>
            <div className="input-group">
              <input
                type="number"
                placeholder={t('datastructure.linkedList.deletePosition')}
                value={positionValue}
                onChange={(e) => setPositionValue(e.target.value)}
                disabled={isRunning}
              />
              <button
                className="action-btn secondary"
                onClick={() => {
                  if (positionValue) {
                    addOperation(`delete ${positionValue}`);
                    setPositionValue('');
                  }
                }}
                disabled={isRunning}
              >
                {t('common.delete')}
              </button>
            </div>
            <div className="input-group">
              <input
                type="number"
                placeholder={t('common.search')}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isRunning}
              />
              <button
                className="action-btn secondary"
                onClick={() => {
                  if (inputValue) {
                    addOperation(`search ${inputValue}`);
                    setInputValue('');
                  }
                }}
                disabled={isRunning}
              >
                {t('common.search')}
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ds-page">
      <div className="ds-controls">
        <div className="operations-section">
          {renderControls()}
        </div>

        <div className="control-group">
          <button
            className="control-btn primary"
            onClick={isRunning ? stopExecution : runOperations}
          >
            {isRunning ? t('common.pause') : t('common.start')}
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

      {operations.length > 0 && (
        <div className="operations-list">
          <h4>{t('datastructure.operations')}:</h4>
          <div className="operations-tags">
            {operations.map((op, index) => (
              <span key={index} className="operation-tag">
                {op}
              </span>
            ))}
          </div>
        </div>
      )}

      <DataStructureVisualizer
        type={getType()}
        data={data}
        highlightedIndices={highlightedIndices}
      />

      <div className="message-box">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default DataStructurePage;
