import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BiasUploader from '../components/BiasUploader';
import BiasResultCard from '../components/BiasResultCard';
import FairnessChart from '../components/FairnessChart';
import AuditReportModal from '../components/AuditReportModal';
import api from '../utils/api';
import '../styles/Analyze.css';

export default function Analyze() {
  const location = useLocation();
  const [domain, setDomain] = useState(location.state?.domain || 'hiring');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [simulatedImprovement, setSimulatedImprovement] = useState(false);

  useEffect(() => {
    if (location.state?.domain) {
      setDomain(location.state.domain);
    }
  }, [location.state]);

  const handleAnalyze = async (dataset, datasetName) => {
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await api.post('/analysis/analyze', {
        domain,
        dataset,
        datasetName,
      });

      setAnalysis(response.data.analysis);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateFix = () => {
    setSimulatedImprovement(!simulatedImprovement);
  };

  const getBiasSeverityColor = (score) => {
    if (score > 60) return '#EF4444'; // Red - Critical
    if (score > 30) return '#F59E0B'; // Yellow - Medium
    return '#10B981'; // Green - Low
  };

  const getBiasSeverityBadge = (score) => {
    if (score > 60) return 'CRITICAL';
    if (score > 30) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className="analyze-page">
      {/* Differentiation Banner */}
      <div className="differentiation-banner">
        🎯 Detecting bias BEFORE it causes harm — Unlike other tools that analyze after damage is done
      </div>

      <div className="analyze-container">
        <header className="analyze-hero">
          <h1>Analyze Your Dataset</h1>
          <p className="subtitle">
            Upload CSV, paste JSON, or use a sample dataset to detect bias,
            fairness gaps, and recommendation opportunities.
          </p>
          {location.state?.quickDemo && (
            <div className="demo-message">
              {location.state.demoMessage}
            </div>
          )}
        </header>

        <BiasUploader
          domain={domain}
          onDomainChange={setDomain}
          onAnalyze={handleAnalyze}
          loading={loading}
        />

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {analysis && (
          <section className="results-section">
            <div className="results-header">
              <div>
                <h2>Analysis Results</h2>
                <p className="subtitle">
                  Review the fairness score, bias breakdown, and recommendations
                  generated for this dataset.
                </p>
              </div>
              <button
                className="report-button"
                type="button"
                onClick={() => setShowReportModal(true)}
              >
                Generate Audit Report
              </button>
            </div>

            <BiasResultCard analysis={analysis} />
            <FairnessChart biasBreakdown={analysis.biasBreakdown || []} />

            {/* Fairness Metrics Panel */}
            <div className="fairness-metrics-panel">
              <h3>Fairness Metrics Panel</h3>
              <div className="metrics-grid">
                <div className="metric-card">
                  <h4>Demographic Parity Score</h4>
                  <p className="formula">|P(outcome|group A) - P(outcome|group B)|</p>
                  <div className="metric-value">
                    {analysis.biasBreakdown && analysis.biasBreakdown.length > 0
                      ? `${Math.max(...Object.values(analysis.biasBreakdown[0]?.groups || {}).map(g => g.biasScore || 0))}%`
                      : 'N/A'
                    }
                  </div>
                </div>
                <div className="metric-card">
                  <h4>Disparate Impact Ratio</h4>
                  <p className="formula">minority_rate ÷ majority_rate</p>
                  <div className="metric-value">
                    {analysis.biasBreakdown && analysis.biasBreakdown.length > 0
                      ? `${(analysis.biasBreakdown[0]?.disparateImpactRatio || 0).toFixed(2)}`
                      : 'N/A'
                    }
                    <span className="legal-note">(&lt; 0.8 = illegal discrimination)</span>
                  </div>
                </div>
                <div className="metric-card">
                  <h4>Statistical Bias Confidence</h4>
                  <div className="metric-value">
                    {analysis.biasBreakdown && analysis.biasBreakdown.length > 0
                      ? analysis.biasBreakdown[0]?.statisticalSignificance || 'Medium'
                      : 'N/A'
                    }
                  </div>
                </div>
                <div className="metric-card">
                  <h4>Legal Risk Indicator</h4>
                  <div className="legal-risks">
                    {domain === 'hiring' && <div>• Title VII, Equal Pay Act</div>}
                    {domain === 'lending' && <div>• Equal Credit Opportunity Act</div>}
                    {domain === 'healthcare' && <div>• ADA, Section 1557</div>}
                    <div>• General: Fair Housing Act</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detected Bias Types Section */}
            {analysis.biasBreakdown && analysis.biasBreakdown.length > 0 && (
              <div className="detected-bias-types">
                <h3>Detected Bias Types</h3>
                <div className="bias-types-grid">
                  {analysis.biasBreakdown.map((bias, index) => (
                    <div key={index} className="bias-type-card">
                      <div className="bias-type-header">
                        <h4>{bias.biasType || 'General Bias'}</h4>
                        <span
                          className={`bias-severity-badge ${getBiasSeverityBadge(bias.biasScore).toLowerCase()}`}
                          style={{
                            backgroundColor: getBiasSeverityColor(bias.biasScore),
                            animation: bias.biasScore > 60 ? 'pulse 2s infinite' : 'none'
                          }}
                        >
                          {getBiasSeverityBadge(bias.biasScore)}
                        </span>
                      </div>
                      <div className="bias-score">
                        <span className="score-number">{bias.biasScore}%</span>
                        <span className="score-label">Bias Score</span>
                      </div>
                      <div className="affected-groups">
                        <p>
                          {bias.minorityGroup?.name} disadvantaged
                        </p>
                      </div>
                      <div className="bias-formula">
                        <small>
                          {bias.dominantGroup?.name} rate: {bias.dominantGroup?.rate}% vs
                          {bias.minorityGroup?.name} rate: {bias.minorityGroup?.rate}%
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impact Simulator */}
            <div className="impact-simulator">
              <h3>Impact Simulator</h3>
              <p>See the difference debiasing makes</p>
              <div className="comparison-table">
                <table>
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Current (Biased)</th>
                      <th>After Fix (Target)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Gender Fairness</td>
                      <td>{analysis.overallFairnessScore || 0}%</td>
                      <td>80%+</td>
                    </tr>
                    <tr>
                      <td>Overall Score</td>
                      <td>{analysis.overallFairnessScore || 0}/100</td>
                      <td>75/100</td>
                    </tr>
                    <tr>
                      <td>Legal Risk</td>
                      <td>Critical</td>
                      <td>Low</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button
                className="simulate-fix-button"
                onClick={handleSimulateFix}
              >
                {simulatedImprovement ? '🔄 Reset Simulation' : '✨ Apply Fix Simulation'}
              </button>
              {simulatedImprovement && (
                <div className="simulation-results">
                  <div className="improvement-animation">
                    <span>Gender Fairness: {analysis.overallFairnessScore || 0}% → 85%</span>
                    <span>Overall Score: {analysis.overallFairnessScore || 0} → 78</span>
                    <span>Legal Risk: Critical → Low</span>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ Recommendations Section — Gemini AI Generated */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div style={{
                marginTop: '24px',
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '24px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '16px'
                }}>
                  ✅ AI-Powered Recommendations
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {analysis.recommendations.map((rec, i) => (
                    <div key={i} style={{
                      background: '#f9fafb',
                      borderRadius: '10px',
                      padding: '16px',
                      border: '1px solid #f3f4f6'
                    }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: '#e0e7ff',
                          color: '#4f46e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '13px',
                          flexShrink: 0
                        }}>
                          {i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{
                            fontWeight: '600',
                            color: '#1f2937',
                            fontSize: '14px',
                            marginBottom: '8px'
                          }}>
                            {rec.title}
                          </h4>
                          {rec.problem && (
                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                              <span style={{ color: '#ef4444', fontWeight: '500' }}>
                                Problem:{' '}
                              </span>
                              {rec.problem}
                            </p>
                          )}
                          {rec.action && (
                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                              <span style={{ color: '#10b981', fontWeight: '500' }}>
                                Action:{' '}
                              </span>
                              {rec.action}
                            </p>
                          )}
                          {rec.expectedImprovement && (
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>
                              <span style={{ color: '#6366f1', fontWeight: '500' }}>
                                Expected Improvement:{' '}
                              </span>
                              {rec.expectedImprovement}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
              <div style={{
                marginTop: '24px',
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '24px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '16px'
                }}>
                  ✅ AI-Powered Recommendations
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {analysis.recommendations.map((rec, i) => (
                    <div key={i} style={{
                      background: '#f9fafb',
                      borderRadius: '10px',
                      padding: '16px',
                      border: '1px solid #f3f4f6'
                    }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: '#e0e7ff',
                          color: '#4f46e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '13px',
                          flexShrink: 0
                        }}>
                          {i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{
                            fontWeight: '600',
                            color: '#1f2937',
                            fontSize: '14px',
                            marginBottom: '8px'
                          }}>
                            {rec.title}
                          </h4>
                          {rec.problem && (
                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                              <span style={{ color: '#ef4444', fontWeight: '500' }}>
                                Problem:{' '}
                              </span>
                              {rec.problem}
                            </p>
                          )}
                          {rec.action && (
                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                              <span style={{ color: '#10b981', fontWeight: '500' }}>
                                Action:{' '}
                              </span>
                              {rec.action}
                            </p>
                          )}
                          {rec.expectedImprovement && (
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>
                              <span style={{ color: '#6366f1', fontWeight: '500' }}>
                                Expected Improvement:{' '}
                              </span>
                              {rec.expectedImprovement}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ Top Discriminatory Patterns */}
            {analysis.topDiscriminatoryPatterns && 
             analysis.topDiscriminatoryPatterns.length > 0 && (
              <div style={{
                marginTop: '16px',
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #fee2e2',
                padding: '24px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '16px'
                }}>
                  🚨 Top Discriminatory Patterns
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {analysis.topDiscriminatoryPatterns.map((pattern, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '12px',
                      background: '#fef2f2',
                      borderRadius: '8px',
                      border: '1px solid #fecaca'
                    }}>
                      <span style={{ 
                        color: '#ef4444', 
                        fontWeight: 'bold', 
                        fontSize: '13px' 
                      }}>
                        {i + 1}.
                      </span>
                      <p style={{ 
                        color: '#374151', 
                        fontSize: '13px', 
                        margin: 0 
                      }}>
                        {pattern}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ Legal Risk + Summary */}
            {(analysis.legalRisk || analysis.summary) && (
              <div style={{
                marginTop: '16px',
                background: '#fffbeb',
                borderRadius: '12px',
                border: '1px solid #fde68a',
                padding: '24px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '12px'
                }}>
                  ⚖️ Legal Risk & Summary
                </h3>
                {analysis.summary && (
                  <p style={{ 
                    color: '#374151', 
                    fontSize: '14px', 
                    marginBottom: '12px',
                    lineHeight: '1.6'
                  }}>
                    {analysis.summary}
                  </p>
                )}
                {analysis.legalRisk && (
                  <p style={{ fontSize: '13px', color: '#92400e' }}>
                    <span style={{ fontWeight: '600' }}>Legal Risk: </span>
                    {analysis.legalRisk}
                  </p>
                )}
              </div>
            )}

          </section>
        )}

        {showReportModal && (
          <AuditReportModal
            analysis={analysis}
            onClose={() => setShowReportModal(false)}
          />
        )}
      </div>
    </div>
  );
}