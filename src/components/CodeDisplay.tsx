import React from 'react';
import { Code, Terminal } from 'lucide-react';
import { ALGORITHM_CODE } from '../algorithms/codeSnippets';
import './CodeDisplay.css';

interface CodeDisplayProps {
  algorithm: string;
  highlightedLines: number[];
  language: 'python' | 'javascript';
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({
  algorithm,
  highlightedLines,
  language,
}) => {
  const code = ALGORITHM_CODE[algorithm]?.[language];
  
  if (!code) {
    return (
      <div className="code-display">
        <div className="code-header">
          <div className="code-title">
            <Code size={18} />
            <span>代码</span>
          </div>
        </div>
        <div className="code-content-wrapper">
          <div className="code-content">
            <p className="code-empty">选择算法以查看代码</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="code-display">
      <div className="code-header">
        <div className="code-title">
          {language === 'python' ? (
            <>
              <Terminal size={18} />
              <span>Python</span>
            </>
          ) : (
            <>
              <Code size={18} />
              <span>JavaScript</span>
            </>
          )}
        </div>
        <div className="code-algorithm">{algorithm}</div>
      </div>
      <div className="code-content-wrapper">
        <div className="code-content">
          {code.lines.map((line, index) => {
            const lineNumber = index + 1;
            const isHighlighted = highlightedLines.includes(lineNumber);
            const description = code.lineHighlights[lineNumber];

            return (
              <div
                key={index}
                className={`code-line ${isHighlighted ? 'highlighted' : ''}`}
                data-line={lineNumber}
              >
                <span className="line-number">{lineNumber}</span>
                <span className="line-content">
                  <span className="line-code">{line || ' '}</span>
                  {description && (
                    <span className="comment">
                      {'  // ' + description}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CodeDisplay;
