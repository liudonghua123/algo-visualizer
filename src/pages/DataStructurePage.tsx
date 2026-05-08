import React, { useState, useEffect, useRef, useCallback } from 'react';
import DataStructureVisualizer from '../components/DataStructureVisualizer';
import { StackNode, QueueNode, LinkedListNode, DataStructureStep } from '../algorithms/dataStructureTypes';
import { stackOperations, queueOperations, linkedListOperations } from '../algorithms/dataStructureOperations';
import './DataStructurePage.css';

interface DataStructurePageProps {
  algorithmId: string;
}

const DataStructurePage: React.FC<DataStructurePageProps> = ({ algorithmId }) => {
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
    setMessage('添加操作后点击"运行"执行');
    setIsRunning(false);
    setOperations([]);
    generatorRef.current = null;
  }, []);

  const addOperation = (op: string) => {
    setOperations((prev) => [...prev, op]);
  };

  const runOperations = useCallback(() => {
    if (operations.length === 0) {
      setMessage('请先添加操作');
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
  }, [operations, algorithmId]);

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
                placeholder="值"
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
                入栈
              </button>
            </div>
            <button
              className="action-btn secondary"
              onClick={() => addOperation('pop')}
              disabled={isRunning}
            >
              出栈
            </button>
            <button
              className="action-btn secondary"
              onClick={() => addOperation('peek')}
              disabled={isRunning}
            >
              查看栈顶
            </button>
          </>
        );
      case 'queue':
        return (
          <>
            <div className="input-group">
              <input
                type="number"
                placeholder="值"
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
                入队
              </button>
            </div>
            <button
              className="action-btn secondary"
              onClick={() => addOperation('dequeue')}
              disabled={isRunning}
            >
              出队
            </button>
            <button
              className="action-btn secondary"
              onClick={() => addOperation('peek')}
              disabled={isRunning}
            >
              查看队首
            </button>
          </>
        );
      case 'linkedList':
        return (
          <>
            <div className="input-group">
              <input
                type="number"
                placeholder="值"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isRunning}
              />
              <input
                type="number"
                placeholder="位置(可选)"
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
                插入
              </button>
            </div>
            <div className="input-group">
              <input
                type="number"
                placeholder="删除位置"
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
                删除
              </button>
            </div>
            <div className="input-group">
              <input
                type="number"
                placeholder="搜索值"
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
                搜索
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
            {isRunning ? '暂停' : '运行'}
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

      {operations.length > 0 && (
        <div className="operations-list">
          <h4>操作序列:</h4>
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
