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
      classes.push('sorted');
    } else if (pivotIndex === index) {
      classes.push('pivot');
    } else if (highlightedIndices.includes(index)) {
      if (highlightedIndices.length === 2) {
        classes.push('comparing');
      } else {
        classes.push('swapping');
      }
    } else {
      classes.push('default');
    }

    return classes.join(' ');
  };

  return (
    <div className="bar-chart" role="img" aria-label="排序可视化柱状图">
      <div className="bar-container">
        {array.map((value, index) => (
          <div key={index} className="bar-wrapper">
            <div
              className={getBarClassName(index)}
              style={{
                height: `${(value / maxValue) * 100}%`,
              }}
              aria-label={`值: ${value}`}
            />
            <span className="bar-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
