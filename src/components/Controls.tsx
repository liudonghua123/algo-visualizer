import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { AlgorithmName, ALGORITHMS } from '../algorithms/types';
import './Controls.css';

interface ControlsProps {
  sorting: boolean;
  completed: boolean;
  algorithm: AlgorithmName;
  speed: number;
  arraySize: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  onAlgorithmChange: (algorithm: AlgorithmName) => void;
  onSpeedChange: (speed: number) => void;
  onSizeChange: (size: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
  sorting,
  completed,
  algorithm,
  speed,
  arraySize,
  onPlay,
  onPause,
  onReset,
  onStep,
  onAlgorithmChange,
  onSpeedChange,
  onSizeChange,
}) => {
  const algorithms = Object.keys(ALGORITHMS) as AlgorithmName[];

  const speedOptions = [
    { value: 500, label: '慢速' },
    { value: 200, label: '中速' },
    { value: 50, label: '快速' },
  ];

  return (
    <div className="controls">
      <div className="control-section">
        <h3 className="control-section-title">控制</h3>
        <div className="control-buttons">
          {!sorting ? (
            <button
              className="control-button control-button-primary"
              onClick={onPlay}
              disabled={completed}
              aria-label="开始排序"
            >
              <Play size={20} />
              <span>播放</span>
            </button>
          ) : (
            <button
              className="control-button control-button-warning"
              onClick={onPause}
              aria-label="暂停排序"
            >
              <Pause size={20} />
              <span>暂停</span>
            </button>
          )}

          <button
            className="control-button control-button-secondary"
            onClick={onStep}
            disabled={sorting || completed}
            aria-label="单步执行"
          >
            <SkipForward size={20} />
            <span>单步</span>
          </button>

          <button
            className="control-button control-button-danger"
            onClick={onReset}
            aria-label="重置"
          >
            <RotateCcw size={20} />
            <span>重置</span>
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3 className="control-section-title">速度</h3>
        <div className="speed-buttons">
          {speedOptions.map((option) => (
            <button
              key={option.value}
              className={`speed-button ${speed === option.value ? 'active' : ''}`}
              onClick={() => onSpeedChange(option.value)}
              aria-label={`速度: ${option.label}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="control-section">
        <h3 className="control-section-title">数组大小: {arraySize}</h3>
        <input
          type="range"
          min="10"
          max="100"
          value={arraySize}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="size-slider"
          disabled={sorting}
          aria-label="数组大小"
        />
      </div>

      <div className="control-section control-section-wide">
        <h3 className="control-section-title">算法选择</h3>
        <div className="algorithm-buttons">
          {algorithms.map((algo) => (
            <button
              key={algo}
              className={`algorithm-button ${algorithm === algo ? 'active' : ''}`}
              onClick={() => onAlgorithmChange(algo)}
              disabled={sorting}
              aria-label={ALGORITHMS[algo].displayName}
            >
              <span className="algorithm-name">{ALGORITHMS[algo].displayName}</span>
              <span className="algorithm-complexity">{ALGORITHMS[algo].timeComplexity}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Controls;
