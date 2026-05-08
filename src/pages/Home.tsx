import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, ALGORITHMS } from '../algorithms/registry';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleAlgorithmClick = (algorithmId: string) => {
    navigate(`/visualize/${algorithmId}`);
  };

  return (
    <div className="home">
      <header className="home-header">
        <h1 className="home-title">算法可视化平台</h1>
        <p className="home-subtitle">
          通过交互式动画深入理解各种算法和数据结构的工作原理
        </p>
      </header>

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
                  <h2 className="category-title">{category.name}</h2>
                  <p className="category-description">{category.description}</p>
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
                      <h3 className="algorithm-name">{algorithm.name}</h3>
                      <p className="algorithm-description">{algorithm.description}</p>
                      <div className="algorithm-complexity">
                        <span className="complexity-item">
                          时间: {algorithm.timeComplexity}
                        </span>
                        <span className="complexity-item">
                          空间: {algorithm.spaceComplexity}
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
