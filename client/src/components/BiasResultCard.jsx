import React from 'react';
import { getScoreColor } from '../utils/biasHelpers';
import '../styles/Components.css';

export default function BiasResultCard({ analysis }) {
  const getScoreBadge = (score) => {
    if (score >= 80) return '✅ Fair';
    if (score >= 60) return '⚠️ Caution';
    if (score >= 40) return '🚨 Biased';
    return '🔴 Critical';
  };

  return (
    <div className="result-card">
      <div className="fairness-meter">
        <div className="meter-circle" style={{
          background: `conic-gradient(${getScoreColor(analysis.overallFairnessScore)} 0deg ${analysis.overallFairnessScore * 3.6}deg, #e0e0e0 ${analysis.overallFairnessScore * 3.6}deg 360deg)`
        }}>
          <div className="meter-inner">
            <div className="score-display">
              {analysis.overallFairnessScore}/100
            </div>
          </div>
        </div>
        <p className="score-badge">{getScoreBadge(analysis.overallFairnessScore)}</p>
      </div>

      <div className="result-details">
        <h3>Analysis Summary</h3>
        <p>{analysis.summary}</p>
        
        <div className="severity-box">
          <strong>Severity Level:</strong>
          <span className={`severity-badge severity-${analysis.severityLevel.toLowerCase()}`}>
            {analysis.severityLevel}
          </span>
        </div>

        <div className="legal-risk">
          <strong>Legal Risk:</strong>
          <span>{analysis.legalRisk}</span>
        </div>
      </div>
    </div>
  );
}
