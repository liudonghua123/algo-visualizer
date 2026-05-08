import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SortingVisualizer from '../components/SortingVisualizer';
import GraphVisualizerPage from './GraphVisualizerPage';
import DataStructurePage from './DataStructurePage';
import SearchVisualizerPage from './SearchVisualizerPage';
import TreeVisualizerPage from './TreeVisualizerPage';
import { ALGORITHMS } from '../algorithms/registry';
import './Visualize.css';

const Visualize: React.FC = () => {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  const navigate = useNavigate();
  const algorithm = ALGORITHMS.find((a) => a.id === algorithmId);

  useEffect(() => {
    if (!algorithm) {
      navigate('/');
    }
  }, [algorithm, navigate]);

  if (!algorithm) {
    return null;
  }

  const renderVisualizer = () => {
    switch (algorithm.category) {
      case 'sorting':
        return <SortingVisualizer algorithmId={algorithm.id} />;
      case 'graph':
        return <GraphVisualizerPage algorithmId={algorithm.id} />;
      case 'datastructure':
        return <DataStructurePage algorithmId={algorithm.id} />;
      case 'search':
        return <SearchVisualizerPage algorithmId={algorithm.id} />;
      case 'tree':
        return <TreeVisualizerPage algorithmId={algorithm.id} />;
      default:
        return <div className="unsupported-message">暂不支持此算法类型</div>;
    }
  };

  return (
    <div className="visualize-page">
      <header className="visualize-header">
        <button
          className="back-button"
          onClick={() => navigate('/')}
          aria-label="返回首页"
        >
          <ArrowLeft size={20} />
          <span>返回</span>
        </button>
        <div className="visualize-title-section">
          <span className="visualize-icon">{algorithm.icon}</span>
          <h1 className="visualize-title">{algorithm.name}</h1>
        </div>
        <p className="visualize-description">{algorithm.description}</p>
        <div className="visualize-meta">
          <span className="meta-item">时间复杂度: {algorithm.timeComplexity}</span>
          <span className="meta-item">空间复杂度: {algorithm.spaceComplexity}</span>
        </div>
      </header>

      <div className="visualize-content">{renderVisualizer()}</div>
    </div>
  );
};

export default Visualize;
