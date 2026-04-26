import React from 'react';
import '../styles/Components.css';

export default function RecommendationPanel({ recommendations }) {
  return (
    <div className="recommendations-panel">
      <h3>🔧 Debiasing Recommendations</h3>
      <p className="rec-subtitle">
        Follow these steps to reduce bias and improve fairness in your decision system
      </p>

      <div className="recommendations-list">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="recommendation-card">
            <div className="rec-header">
              <span className="rec-number">{idx + 1}</span>
              <h4>{rec.title}</h4>
            </div>

            <div className="rec-content">
              <div className="rec-section">
                <strong>Problem:</strong>
                <p>{rec.problem}</p>
              </div>

              <div className="rec-section">
                <strong>Action Steps:</strong>
                <p style={{ whiteSpace: 'pre-wrap' }}>{rec.action}</p>
              </div>

              <div className="rec-improvement">
                <strong>Expected Improvement:</strong>
                <span className="improvement-value">+{rec.expectedImprovement}</span>
              </div>
            </div>

            <button className="learn-more-btn">
              Learn More →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
