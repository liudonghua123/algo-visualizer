import React from 'react';
import { StackNode, QueueNode, LinkedListNode } from '../algorithms/dataStructureTypes';
import './DataStructureVisualizer.css';

interface DataStructureVisualizerProps {
  type: 'stack' | 'queue' | 'linkedList';
  data: StackNode[] | QueueNode[] | LinkedListNode[];
  highlightedIndices: number[];
}

const DataStructureVisualizer: React.FC<DataStructureVisualizerProps> = ({
  type,
  data,
  highlightedIndices,
}) => {
  const renderStack = () => (
    <div className="stack-container">
      <div className="structure-label">栈顶 ↑</div>
      <div className="stack">
        {[...data].reverse().map((node, index) => {
          const actualIndex = data.length - 1 - index;
          const stackNode = node as StackNode;
          return (
            <div
              key={actualIndex}
              className={`stack-node ${highlightedIndices.includes(actualIndex) ? 'highlighted' : ''}`}
            >
              <span className="node-value">{stackNode.value}</span>
              <span className="node-index">[{actualIndex}]</span>
            </div>
          );
        })}
      </div>
      <div className="structure-label">栈底</div>
    </div>
  );

  const renderQueue = () => (
    <div className="queue-container">
      <div className="structure-labels">
        <span className="structure-label">队首 ←</span>
        <span className="structure-label">→ 队尾</span>
      </div>
      <div className="queue">
        {data.map((node, index) => {
          const queueNode = node as QueueNode;
          return (
            <div
              key={index}
              className={`queue-node ${highlightedIndices.includes(index) ? 'highlighted' : ''}`}
            >
              <span className="node-value">{queueNode.value}</span>
              <span className="node-index">[{index}]</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderLinkedList = () => (
    <div className="linked-list-container">
      <div className="structure-label">链表</div>
      <div className="linked-list">
        {data.map((node, index) => {
          const listNode = node as LinkedListNode;
          return (
            <React.Fragment key={index}>
              <div className={`list-node ${highlightedIndices.includes(index) ? 'highlighted' : ''}`}>
                <div className="node-value">{listNode.value}</div>
                <div className="node-next">
                  {listNode.next !== null ? '→' : '∅'}
                </div>
              </div>
              {listNode.next !== null && index < data.length - 1 && (
                <div className="list-arrow">→</div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="data-structure-visualizer">
      {type === 'stack' && renderStack()}
      {type === 'queue' && renderQueue()}
      {type === 'linkedList' && renderLinkedList()}
    </div>
  );
};

export default DataStructureVisualizer;
