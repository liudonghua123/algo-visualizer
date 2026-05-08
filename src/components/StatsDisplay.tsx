import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart2, RefreshCw, Clock } from 'lucide-react';
import './StatsDisplay.css';

interface StatsDisplayProps {
  comparisons: number;
  swaps: number;
  elapsedTime: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  comparisons,
  swaps,
  elapsedTime,
}) => {
  const { t } = useTranslation();

  return (
    <div className="stats-display" role="status" aria-live="polite">
      <div className="stat-item">
        <div className="stat-icon">
          <BarChart2 size={20} />
        </div>
        <div className="stat-content">
          <div className="stat-label">{t('common.comparisons')}</div>
          <div className="stat-value">{comparisons.toLocaleString()}</div>
        </div>
      </div>

      <div className="stat-divider" />

      <div className="stat-item">
        <div className="stat-icon">
          <RefreshCw size={20} />
        </div>
        <div className="stat-content">
          <div className="stat-label">{t('common.swaps')}</div>
          <div className="stat-value">{swaps.toLocaleString()}</div>
        </div>
      </div>

      <div className="stat-divider" />

      <div className="stat-item">
        <div className="stat-icon">
          <Clock size={20} />
        </div>
        <div className="stat-content">
          <div className="stat-label">{t('common.timeComplexity')}</div>
          <div className="stat-value">{elapsedTime.toFixed(2)}s</div>
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;
