import React, { useState } from 'react';
import BiasUploader from '../components/BiasUploader';
import BiasResultCard from '../components/BiasResultCard';
import FairnessChart from '../components/FairnessChart';
import AuditReportModal from '../components/AuditReportModal';
import api from '../utils/api';
import '../styles/Analyze.css';

export default function Analyze() {
  const [domain, setDomain] = useState('hiring');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

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

  return (
    <div className="analyze-page">
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