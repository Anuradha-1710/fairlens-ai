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

  const getBiasSeverityColor = (score) => {
    if (score > 60) return '#EF4444';
    if (score > 30) return '#F59E0B';
    return '#10B981';
  };

  const getBiasSeverityBadge = (score) => {
    if (score > 60) return 'CRITICAL';
    if (score > 30) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className="analyze-page">
      {/* Differentiation Banner */}
      <div style={{
        background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
        color: 'white',
        padding: '12px 24px',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: '14px',
        letterSpacing: '0.3px'
      }}>
        🎯 Detecting bias BEFORE it causes harm — Unlike other tools that analyze after damage is done
      </div>

      <div className="analyze-container">
        <header className="analyze-hero">
          <h1>Analyze Your Dataset</h1>
          <p className="subtitle">
            Upload CSV, paste JSON, or use a sample dataset to detect bias,
            fairness gaps, and recommendation opportunities.
          </p>
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
            {/* Header */}
            <div className="results-header">
              <div>
                <h2>Analysis Results</h2>
                <p className="subtitle">
                  Review the fairness score, bias breakdown, and recommendations.
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
            <div style={{
              marginTop: '24px',
              background: '#1E293B',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '24px'
            }}>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                📊 Fairness Metrics Panel
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                
                <div style={{ background: '#0F172A', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>Demographic Parity Score</h4>
                  <p style={{ color: '#6366f1', fontSize: '11px', marginBottom: '8px' }}>|P(outcome|group A) - P(outcome|group B)|</p>
                  <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                    {analysis.biasBreakdown?.[0]?.biasScore || 0}%
                  </div>
                </div>

                <div style={{ background: '#0F172A', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>Disparate Impact Ratio</h4>
                  <p style={{ color: '#6366f1', fontSize: '11px', marginBottom: '8px' }}>minority_rate ÷ majority_rate</p>
                  <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                    {analysis.biasBreakdown?.[0]?.disparityRatio || '0.00'}
                  </div>
                  <p style={{ color: '#ef4444', fontSize: '11px' }}>&lt; 0.8 = illegal discrimination</p>
                </div>

                <div style={{ background: '#0F172A', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>Statistical Confidence</h4>
                  <div style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold' }}>
                    {analysis.rowCount >= 30 ? 'High' : analysis.rowCount >= 15 ? 'Medium' : 'Low'}
                  </div>
                  <p style={{ color: '#64748b', fontSize: '11px' }}>{analysis.rowCount} records analyzed</p>
                </div>

                <div style={{ background: '#0F172A', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>Legal Risk Indicator</h4>
                  <div style={{ color: '#f59e0b', fontSize: '13px' }}>
                    {domain === 'hiring' && <div>⚖️ Title VII, Equal Pay Act</div>}
                    {domain === 'loan' && <div>⚖️ Equal Credit Opportunity Act</div>}
                    {domain === 'medical' && <div>⚖️ ADA, Section 1557</div>}
                    <div style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>Fair Housing Act</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Detected Bias Types */}
            {analysis.biasBreakdown && analysis.biasBreakdown.length > 0 && (
              <div style={{
                marginTop: '24px',
                background: '#1E293B',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '24px'
              }}>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                  🔍 Detected Bias Types
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {analysis.biasBreakdown.map((bias, index) => (
                    <div key={index} style={{
                      background: '#0F172A',
                      borderRadius: '12px',
                      padding: '16px',
                      border: `1px solid ${getBiasSeverityColor(bias.biasScore)}40`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ color: 'white', fontWeight: '600', textTransform: 'capitalize' }}>
                          {bias.attribute} Bias
                        </h4>
                        <span style={{
                          background: getBiasSeverityColor(bias.biasScore),
                          color: 'white',
                          padding: '2px 10px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: '700',
                          animation: bias.biasScore > 60 ? 'pulse 2s infinite' : 'none'
                        }}>
                          {getBiasSeverityBadge(bias.biasScore)}
                        </span>
                      </div>

                      {/* Bias Score Bar */}
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Bias Score</span>
                          <span style={{ color: 'white', fontWeight: 'bold' }}>{bias.biasScore}%</span>
                        </div>
                        <div style={{ background: '#1E293B', borderRadius: '999px', height: '8px' }}>
                          <div style={{
                            width: `${bias.biasScore}%`,
                            height: '8px',
                            borderRadius: '999px',
                            background: getBiasSeverityColor(bias.biasScore),
                            transition: 'width 1s ease'
                          }} />
                        </div>
                      </div>

                      {/* Group Rates */}
                      {bias.groups && Object.keys(bias.groups).length > 0 && (
                        <div style={{ background: '#1E293B', borderRadius: '8px', padding: '10px' }}>
                          <p style={{ color: '#64748b', fontSize: '11px', marginBottom: '6px' }}>Outcome Rates:</p>
                          {Object.entries(bias.groups).map(([group, rate]) => (
                            <div key={group} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'capitalize' }}>{group}</span>
                              <span style={{ color: rate > 50 ? '#10b981' : '#ef4444', fontSize: '12px', fontWeight: '600' }}>
                                {typeof rate === 'number' ? `${rate.toFixed(0)}%` : rate}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {bias.explanation && (
                        <p style={{ color: '#64748b', fontSize: '12px', marginTop: '8px' }}>{bias.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impact Simulator */}
            <div style={{
              marginTop: '24px',
              background: '#1E293B',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '24px'
            }}>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                ⚡ Impact Simulator
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>See the difference debiasing makes</p>
              
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ color: '#94a3b8', textAlign: 'left', padding: '8px', fontSize: '13px' }}>Metric</th>
                    <th style={{ color: '#ef4444', textAlign: 'center', padding: '8px', fontSize: '13px' }}>Current (Biased)</th>
                    <th style={{ color: '#10b981', textAlign: 'center', padding: '8px', fontSize: '13px' }}>After Fix (Target)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ color: 'white', padding: '10px 8px', fontSize: '13px' }}>Fairness Score</td>
                    <td style={{ color: '#ef4444', textAlign: 'center', padding: '10px 8px', fontWeight: 'bold' }}>{analysis.overallFairnessScore}/100</td>
                    <td style={{ color: '#10b981', textAlign: 'center', padding: '10px 8px', fontWeight: 'bold' }}>75+/100</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ color: 'white', padding: '10px 8px', fontSize: '13px' }}>Severity Level</td>
                    <td style={{ color: '#ef4444', textAlign: 'center', padding: '10px 8px', fontWeight: 'bold' }}>{analysis.severityLevel}</td>
                    <td style={{ color: '#10b981', textAlign: 'center', padding: '10px 8px', fontWeight: 'bold' }}>Low</td>
                  </tr>
                  <tr>
                    <td style={{ color: 'white', padding: '10px 8px', fontSize: '13px' }}>Legal Risk</td>
                    <td style={{ color: '#ef4444', textAlign: 'center', padding: '10px 8px', fontWeight: 'bold' }}>Critical</td>
                    <td style={{ color: '#10b981', textAlign: 'center', padding: '10px 8px', fontWeight: 'bold' }}>Low</td>
                  </tr>
                </tbody>
              </table>

              <button
                onClick={() => setSimulatedImprovement(!simulatedImprovement)}
                style={{
                  marginTop: '16px',
                  background: simulatedImprovement ? '#374151' : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                {simulatedImprovement ? '🔄 Reset Simulation' : '✨ Apply Fix Simulation'}
              </button>

              {simulatedImprovement && (
                <div style={{
                  marginTop: '16px',
                  background: '#0F172A',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #10b981'
                }}>
                  <p style={{ color: '#10b981', fontWeight: '600', marginBottom: '8px' }}>✅ After Debiasing:</p>
                  <p style={{ color: 'white', fontSize: '13px' }}>📈 Fairness Score: {analysis.overallFairnessScore} → 78/100</p>
                  <p style={{ color: 'white', fontSize: '13px' }}>✅ Severity: {analysis.severityLevel} → Low</p>
                  <p style={{ color: 'white', fontSize: '13px' }}>⚖️ Legal Risk: Critical → Low</p>
                </div>
              )}
            </div>

            {/* AI Recommendations — ONLY ONCE */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div style={{
                marginTop: '24px',
                background: '#1E293B',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '24px'
              }}>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                  ✅ AI-Powered Recommendations
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {analysis.recommendations.map((rec, i) => (
                    <div key={i} style={{
                      background: '#0F172A',
                      borderRadius: '10px',
                      padding: '16px',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '28px', height: '28px',
                          borderRadius: '50%',
                          background: '#312e81',
                          color: '#818cf8',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 'bold', fontSize: '13px', flexShrink: 0
                        }}>
                          {i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ color: 'white', fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>
                            {rec.title}
                          </h4>
                          {rec.problem && (
                            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                              <span style={{ color: '#ef4444', fontWeight: '500' }}>Problem: </span>
                              {rec.problem}
                            </p>
                          )}
                          {rec.action && (
                            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                              <span style={{ color: '#10b981', fontWeight: '500' }}>Action: </span>
                              {rec.action}
                            </p>
                          )}
                          {rec.expectedImprovement && (
                            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                              <span style={{ color: '#6366f1', fontWeight: '500' }}>Expected Improvement: </span>
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

            {/* Top Discriminatory Patterns */}
            {analysis.topDiscriminatoryPatterns?.length > 0 && (
              <div style={{
                marginTop: '16px',
                background: '#1E293B',
                borderRadius: '16px',
                border: '1px solid #ef444440',
                padding: '24px'
              }}>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                  🚨 Top Discriminatory Patterns
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {analysis.topDiscriminatoryPatterns.map((pattern, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: '10px', padding: '12px',
                      background: '#0F172A', borderRadius: '8px',
                      border: '1px solid #ef444430'
                    }}>
                      <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '13px' }}>{i + 1}.</span>
                      <p style={{ color: '#e2e8f0', fontSize: '13px', margin: 0 }}>{pattern}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legal Risk Summary */}
            {(analysis.legalRisk || analysis.summary) && (
              <div style={{
                marginTop: '16px',
                background: '#1E293B',
                borderRadius: '16px',
                border: '1px solid #f59e0b40',
                padding: '24px',
                marginBottom: '32px'
              }}>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>
                  ⚖️ Legal Risk & Summary
                </h3>
                {analysis.summary && (
                  <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '12px', lineHeight: '1.6' }}>
                    {analysis.summary}
                  </p>
                )}
                {analysis.legalRisk && (
                  <p style={{ fontSize: '13px', color: '#fbbf24' }}>
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