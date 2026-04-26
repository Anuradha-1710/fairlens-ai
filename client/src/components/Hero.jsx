import React from 'react';
import '../styles/Components.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>See the Bias. Fix the Future.</h1>
        <p className="hero-subtitle">
          FairLens AI detects discrimination in automated decisions across 
          hiring, loans, and healthcare — powered by Google Gemini.
        </p>
        <div className="hero-highlight">
          <p>
            ⚠️ <strong>The Problem:</strong> AI systems trained on biased historical data 
            perpetuate discrimination at scale.
          </p>
          <p>
            ✅ <strong>The Solution:</strong> Real-time bias detection with 
            actionable debiasing recommendations.
          </p>
        </div>
      </div>
    </section>
  );
}
