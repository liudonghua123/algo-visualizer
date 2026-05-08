import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
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
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
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
        return <div className="unsupported-message">{t('common.unsupported')}</div>;
    }
  };

  const algorithmDetails = {
    principle: t(`${algorithm.category}.${algorithm.id}.principle`),
    steps: t(`${algorithm.category}.${algorithm.id}.steps`, { returnObjects: true }) as string[],
    timeComplexity: t(`${algorithm.category}.${algorithm.id}.timeComplexity`),
    spaceComplexity: t(`${algorithm.category}.${algorithm.id}.spaceComplexity`),
    scenarios: t(`${algorithm.category}.${algorithm.id}.scenarios`),
    example: t(`${algorithm.category}.${algorithm.id}.example`),
  };

  return (
    <div className="visualize-page">
      <header className="visualize-header">
        <button
          className="back-button"
          onClick={() => navigate('/')}
          aria-label={t('common.back')}
        >
          <ArrowLeft size={20} />
          <span>{t('common.back')}</span>
        </button>
        <div className="visualize-title-section">
          <span className="visualize-icon">{algorithm.icon}</span>
          <h1 className="visualize-title">
            {t(`${algorithm.category}.${algorithm.id}.name`)}
          </h1>
        </div>
        <p className="visualize-description">
          {t(`${algorithm.category}.${algorithm.id}.description`)}
        </p>
        <div className="visualize-meta">
          <span className="meta-item">
            {t('common.timeComplexity')}: {algorithm.timeComplexity}
          </span>
          <span className="meta-item">
            {t('common.spaceComplexity')}: {algorithm.spaceComplexity}
          </span>
        </div>

        <button
          className="details-toggle"
          onClick={() => setShowDetails(!showDetails)}
        >
          <BookOpen size={18} />
          <span>{t('common.description')}</span>
          {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showDetails && (
          <div className="algorithm-details">
            <section className="detail-section">
              <h3>{t('common.principle')}</h3>
              <p>{algorithmDetails.principle}</p>
            </section>

            <section className="detail-section">
              <h3>{t('common.steps')}</h3>
              <ol>
                {Array.isArray(algorithmDetails.steps) && 
                  algorithmDetails.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))
                }
              </ol>
            </section>

            <section className="detail-section">
              <h3>{t('common.timeComplexity')}</h3>
              <p>{algorithmDetails.timeComplexity}</p>
            </section>

            <section className="detail-section">
              <h3>{t('common.spaceComplexity')}</h3>
              <p>{algorithmDetails.spaceComplexity}</p>
            </section>

            <section className="detail-section">
              <h3>{t('common.scenarios')}</h3>
              <p>{algorithmDetails.scenarios}</p>
            </section>

            <section className="detail-section">
              <h3>{t('common.example')}</h3>
              <p>{algorithmDetails.example}</p>
            </section>
          </div>
        )}
      </header>

      <div className="visualize-content">{renderVisualizer()}</div>
    </div>
  );
};

export default Visualize;
