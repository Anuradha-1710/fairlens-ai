import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import DomainSelector from '../components/DomainSelector';
import '../styles/Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState(null);

  const handleStartAnalysis = () => {
    if (selectedDomain) {
      navigate('/analyze', { state: { domain: selectedDomain } });
    }
  };

  return (
    <div className="home">
      <Hero />
      
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Data Ingestion</h3>
            <p>Upload CSV, paste JSON, or use sample datasets instantly</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>Gemini AI Analysis</h3>
            <p>Real-time bias detection powered by Google Gemini 1.5 Flash</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Visual Dashboard</h3>
            <p>Interactive charts showing fairness metrics and bias scores</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>Debiasing Recommendations</h3>
            <p>Actionable AI-generated suggestions to fix bias</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Audit Reports</h3>
            <p>Generate and share downloadable fairness reports</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure & Private</h3>
            <p>Enterprise-grade security with JWT authentication</p>
          </div>
        </div>
      </section>

      <section className="domain-section">
        <h2>Choose Your Domain</h2>
        <DomainSelector 
          selectedDomain={selectedDomain} 
          onSelect={setSelectedDomain} 
        />
        <button 
          className="cta-button"
          onClick={handleStartAnalysis}
          disabled={!selectedDomain}
        >
          Start Analyzing →
        </button>
      </section>

      <section className="stats-section">
        <h2>The Problem We're Solving</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">73%</div>
            <p>Of HR systems show gender bias in hiring</p>
          </div>
          <div className="stat-card">
            <div className="stat-number">80%</div>
            <p>Of loan algorithms show racial bias</p>
          </div>
          <div className="stat-card">
            <div className="stat-number">60%</div>
            <p>Of medical AI shows socioeconomic bias</p>
          </div>
          <div className="stat-card">
            <div className="stat-number">∞</div>
            <p>Lives affected by unfair AI decisions daily</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How FairLens AI Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload Data</h3>
            <p>Share your decision dataset (CSV, JSON, or sample)</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>AI Analysis</h3>
            <p>Gemini AI detects bias patterns in seconds</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Recommendations</h3>
            <p>Receive actionable debiasing recommendations</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Generate Report</h3>
            <p>Download audit report and track improvements</p>
          </div>
        </div>
      </section>
    </div>
  );
}
