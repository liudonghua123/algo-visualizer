import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const algorithms = Object.keys(ALGORITHMS) as AlgorithmName[];

  const speedOptions = [
    { value: 500, label: t('common.slow') },
    { value: 200, label: t('common.medium') },
    { value: 50, label: t('common.fast') },
  ];

  return (
    <div className="controls">
      <div className="control-section">
        <h3 className="control-section-title">{t('common.controls')}</h3>
        <div className="control-buttons">
          {!sorting ? (
            <button
              className="control-button control-button-primary"
              onClick={onPlay}
              disabled={completed}
              aria-label={t('common.start')}
            >
              <Play size={20} />
              <span>{t('common.start')}</span>
            </button>
          ) : (
            <button
              className="control-button control-button-warning"
              onClick={onPause}
              aria-label={t('common.pause')}
            >
              <Pause size={20} />
              <span>{t('common.pause')}</span>
            </button>
          )}

          <button
            className="control-button control-button-secondary"
            onClick={onStep}
            disabled={sorting || completed}
            aria-label={t('common.step')}
          >
            <SkipForward size={20} />
            <span>{t('common.step')}</span>
          </button>

          <button
            className="control-button control-button-danger"
            onClick={onReset}
            aria-label={t('common.reset')}
          >
            <RotateCcw size={20} />
            <span>{t('common.reset')}</span>
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3 className="control-section-title">{t('common.speed')}</h3>
        <div className="speed-buttons">
          {speedOptions.map((option) => (
            <button
              key={option.value}
              className={`speed-button ${speed === option.value ? 'active' : ''}`}
              onClick={() => onSpeedChange(option.value)}
              aria-label={`${t('common.speed')}: ${option.label}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="control-section">
        <h3 className="control-section-title">{t('common.size')}: {arraySize}</h3>
        <input
          type="range"
          min="10"
          max="100"
          value={arraySize}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="size-slider"
          disabled={sorting}
          aria-label={t('common.size')}
        />
      </div>

      <div className="control-section control-section-wide">
        <h3 className="control-section-title">{t('common.algorithm')}</h3>
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
