import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import CodeDisplay from '@/components/CodeDisplay';
import './DataStructurePage.css';

interface DataStructurePageProps {
  algorithmId: string;
}

const DataStructurePage: React.FC<DataStructurePageProps> = ({ algorithmId }) => {
  const { t } = useTranslation();
  const [dataStructure, setDataStructure] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);
  const [dsType, setDsType] = useState<'stack' | 'queue' | 'linkedList'>(
    algorithmId === 'stack' ? 'stack' : algorithmId === 'queue' ? 'queue' : 'linkedList'
  );
  const [codeLanguage, setCodeLanguage] = useState<'python' | 'javascript'>('python');
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

  const animationRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setDataStructure([]);
    setMessage('');
    setIsRunning(false);
    setHighlightedLines([]);
  }, []);

  const addOperation = useCallback((operation: string) => {
    const val = inputValue.trim();
    if (!val) {
      setMessage(t('datastructure.enterValue'));
      return;
    }

    setIsRunning(true);
    setHighlightedLines([4, 5]);

    animationRef.current = requestAnimationFrame(() => {
      setTimeout(() => {
        switch (operation) {
          case 'push':
            setDataStructure(prev => [...prev, val]);
            setMessage(`${val} ${t('datastructure.pushed')}`);
            setHighlightedLines([4, 5]);
            break;
          case 'enqueue':
            setDataStructure(prev => [val, ...prev]);
            setMessage(`${val} ${t('datastructure.enqueued')}`);
            setHighlightedLines([8, 9]);
            break;
          case 'insert':
            setDataStructure(prev => [...prev, val]);
            setMessage(`${val} ${t('datastructure.inserted')}`);
            setHighlightedLines([10, 11, 12, 13]);
            break;
          default:
            break;
        }
        setIsRunning(false);
      }, speed);
    });
  }, [inputValue, speed, t]);

  const removeOperation = useCallback((operation: string) => {
    if (dataStructure.length === 0) {
      setMessage(t('datastructure.empty'));
      return;
    }

    setIsRunning(true);

    animationRef.current = requestAnimationFrame(() => {
      setTimeout(() => {
        switch (operation) {
          case 'pop':
            const popped = dataStructure[dataStructure.length - 1];
            setDataStructure(prev => prev.slice(0, -1));
            setMessage(`${t('datastructure.popped')}: ${popped}`);
            setHighlightedLines([7, 8, 9]);
            break;
          case 'dequeue':
            const dequeued = dataStructure[0];
            setDataStructure(prev => prev.slice(1));
            setMessage(`${t('datastructure.dequeued')}: ${dequeued}`);
            setHighlightedLines([11, 12, 13]);
            break;
          case 'delete':
            const deleted = dataStructure[dataStructure.length - 1];
            setDataStructure(prev => prev.slice(0, -1));
            setMessage(`${t('datastructure.deleted')}: ${deleted}`);
            setHighlightedLines([17, 18, 19]);
            break;
          default:
            break;
        }
        setIsRunning(false);
      }, speed);
    });
  }, [dataStructure, speed, t]);

  const peekOperation = useCallback(() => {
    if (dataStructure.length === 0) {
      setMessage(t('datastructure.empty'));
      return;
    }

    const top = dsType === 'queue' ? dataStructure[0] : dataStructure[dataStructure.length - 1];
    setMessage(`${t('common.peek')}: ${top}`);
    setHighlightedLines([11, 12, 13]);
  }, [dataStructure, dsType, t]);

  useEffect(() => {
    reset();
  }, [algorithmId, reset]);

  const renderVisualization = () => {
    return (
      <div className="ds-visualization">
        {dsType === 'stack' && (
          <div className="stack-container">
            <div className="stack-label">{t('datastructure.stack.top')}</div>
            <div className="stack-items">
              {[...dataStructure].reverse().map((item, idx) => (
                <div key={idx} className={`stack-item ${idx === 0 ? 'top' : ''}`}>
                  {item}
                </div>
              ))}
              {dataStructure.length === 0 && (
                <div className="empty-state">{t('datastructure.empty')}</div>
              )}
            </div>
          </div>
        )}

        {dsType === 'queue' && (
          <div className="queue-container">
            <div className="queue-label-front">{t('datastructure.queue.front')}</div>
            <div className="queue-items">
              {dataStructure.map((item, idx) => (
                <div key={idx} className={`queue-item ${idx === 0 ? 'front' : ''}`}>
                  {item}
                </div>
              ))}
              {dataStructure.length === 0 && (
                <div className="empty-state">{t('datastructure.empty')}</div>
              )}
            </div>
            <div className="queue-label-rear">{t('datastructure.queue.rear')}</div>
          </div>
        )}

        {dsType === 'linkedList' && (
          <div className="linked-list-container">
            <div className="linked-list-label">{t('datastructure.linkedList.head')}</div>
            <div className="linked-list-items">
              {dataStructure.map((item, idx) => (
                <React.Fragment key={idx}>
                  <div className="ll-node">
                    <span className="ll-value">{item}</span>
                  </div>
                  {idx < dataStructure.length - 1 && <span className="ll-arrow">→</span>}
                </React.Fragment>
              ))}
              {dataStructure.length === 0 && (
                <div className="empty-state">{t('datastructure.empty')}</div>
              )}
              <div className="ll-null">null</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="ds-page">
      <div className="ds-controls">
        <div className="control-group">
          <label>{t('datastructure.type')}:</label>
          <button
            className={`toggle-btn ${dsType === 'stack' ? 'active' : ''}`}
            onClick={() => { setDsType('stack'); reset(); }}
            disabled={isRunning}
          >
            {t('datastructure.stack.name')}
          </button>
          <button
            className={`toggle-btn ${dsType === 'queue' ? 'active' : ''}`}
            onClick={() => { setDsType('queue'); reset(); }}
            disabled={isRunning}
          >
            {t('datastructure.queue.name')}
          </button>
          <button
            className={`toggle-btn ${dsType === 'linkedList' ? 'active' : ''}`}
            onClick={() => { setDsType('linkedList'); reset(); }}
            disabled={isRunning}
          >
            {t('datastructure.linkedList.name')}
          </button>
        </div>

        <div className="input-group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('datastructure.enterValue')}
            disabled={isRunning}
          />
          {dsType === 'stack' && (
            <>
              <button className="action-btn" onClick={() => addOperation('push')} disabled={isRunning}>
                {t('datastructure.stack.push')}
              </button>
              <button className="action-btn secondary" onClick={() => removeOperation('pop')} disabled={isRunning}>
                {t('datastructure.stack.pop')}
              </button>
            </>
          )}
          {dsType === 'queue' && (
            <>
              <button className="action-btn" onClick={() => addOperation('enqueue')} disabled={isRunning}>
                {t('datastructure.queue.enqueue')}
              </button>
              <button className="action-btn secondary" onClick={() => removeOperation('dequeue')} disabled={isRunning}>
                {t('datastructure.queue.dequeue')}
              </button>
            </>
          )}
          {dsType === 'linkedList' && (
            <>
              <button className="action-btn" onClick={() => addOperation('insert')} disabled={isRunning}>
                {t('datastructure.linkedList.insert')}
              </button>
              <button className="action-btn secondary" onClick={() => removeOperation('delete')} disabled={isRunning}>
                {t('datastructure.linkedList.delete')}
              </button>
            </>
          )}
        </div>

        <div className="control-group">
          <button className="action-btn secondary" onClick={peekOperation} disabled={isRunning}>
            {t('common.peek')}
          </button>
          <button className="action-btn secondary" onClick={reset} disabled={isRunning}>
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
          {renderVisualization()}

          <div className="message-box">
            <p>{message || t('datastructure.instruction')}</p>
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
            algorithm={dsType}
            highlightedLines={highlightedLines}
            language={codeLanguage}
          />
        </div>
      </div>
    </div>
  );
};

export default DataStructurePage;
