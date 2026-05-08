import React from 'react';
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
  return (
    <div className="stats-display" role="status" aria-live="polite">
      <div className="stat-item">
        <div className="stat-icon">
          <BarChart2 size={20} />
        </div>
        <div className="stat-content">
          <div className="stat-label">比较次数</div>
          <div className="stat-value">{comparisons.toLocaleString()}</div>
        </div>
      </div>

      <div className="stat-divider" />

      <div className="stat-item">
        <div className="stat-icon">
          <RefreshCw size={20} />
        </div>
        <div className="stat-content">
          <div className="stat-label">交换次数</div>
          <div className="stat-value">{swaps.toLocaleString()}</div>
        </div>
      </div>

      <div className="stat-divider" />

      <div className="stat-item">
        <div className="stat-icon">
          <Clock size={20} />
        </div>
        <div className="stat-content">
          <div className="stat-label">执行时间</div>
          <div className="stat-value">{elapsedTime.toFixed(2)}s</div>
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;
