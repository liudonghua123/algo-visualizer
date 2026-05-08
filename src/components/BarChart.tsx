import React from 'react';
import './BarChart.css';

interface BarChartProps {
  array: number[];
  highlightedIndices: number[];
  sortedIndices: number[];
  pivotIndex?: number;
  maxValue: number;
}

const BarChart: React.FC<BarChartProps> = ({
  array,
  highlightedIndices,
  sortedIndices,
  pivotIndex,
  maxValue,
}) => {
  const getBarClassName = (index: number) => {
    const classes = ['bar'];

    if (sortedIndices.includes(index)) {
      classes.push('bar-sorted');
    } else if (pivotIndex === index) {
      classes.push('bar-pivot');
    } else if (highlightedIndices.includes(index)) {
      if (highlightedIndices.length === 2) {
        classes.push('bar-comparing');
      } else {
        classes.push('bar-swapping');
      }
    } else {
      classes.push('bar-default');
    }

    return classes.join(' ');
  };

  const barWidth = Math.max(4, Math.min(40, Math.floor(600 / array.length) - 2));

  return (
    <div className="bar-chart" role="img" aria-label="排序可视化柱状图">
      <div className="bar-chart-container">
        {array.map((value, index) => (
          <div
            key={index}
            className={getBarClassName(index)}
            style={{
              height: `${(value / maxValue) * 100}%`,
              width: `${barWidth}px`,
            }}
            aria-label={`值: ${value}`}
          >
            <div className="bar-value">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
