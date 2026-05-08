import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CATEGORIES, ALGORITHMS } from '../algorithms/registry';
import { Sparkles, Play } from 'lucide-react';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAlgorithmClick = (algorithmId: string) => {
    navigate(`/visualize/${algorithmId}`);
  };

  return (
    <div className="home">
      <section className="home-hero">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>Interactive Algorithm Visualization</span>
        </div>
        <h1 className="hero-title">{t('home.title')}</h1>
        <p className="hero-subtitle">{t('home.subtitle')}</p>
        <div className="hero-actions">
          <button 
            className="hero-btn hero-btn-primary"
            onClick={() => document.querySelector('.category-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Play size={18} />
            <span>{t('home.explore')}</span>
          </button>
        </div>
      </section>

      <div className="categories">
        {CATEGORIES.map((category) => {
          const categoryAlgorithms = ALGORITHMS.filter(
            (algo) => algo.category === category.id
          );

          return (
            <div key={category.id} className="category-section">
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <div className="category-info">
                  <h2 className="category-title">
                    {t(`categories.${category.id}`)}
                  </h2>
                  <p className="category-description">
                    {t(`${category.id}.description`)}
                  </p>
                </div>
              </div>

              <div className="algorithms-grid">
                {categoryAlgorithms.map((algorithm) => (
                  <button
                    key={algorithm.id}
                    className="algorithm-card"
                    onClick={() => handleAlgorithmClick(algorithm.id)}
                    aria-label={algorithm.name}
                  >
                    <div className="algorithm-icon">{algorithm.icon}</div>
                    <div className="algorithm-info">
                      <h3 className="algorithm-name">
                        {t(`${algorithm.category}.${algorithm.id}.name`)}
                      </h3>
                      <p className="algorithm-description">
                        {t(`${algorithm.category}.${algorithm.id}.description`)}
                      </p>
                      <div className="algorithm-complexity">
                        <span className="complexity-item">
                          {t('common.timeComplexity')}: {algorithm.timeComplexity}
                        </span>
                        <span className="complexity-item">
                          {t('common.spaceComplexity')}: {algorithm.spaceComplexity}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
