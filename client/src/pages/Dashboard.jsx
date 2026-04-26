import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import BiasResultCard from '../components/BiasResultCard';
import RecommendationPanel from '../components/RecommendationPanel';
import { formatDate } from '../utils/biasHelpers';
import '../styles/Dashboard.css';

const domainLabels = {
  all: 'All Domains',
  hiring: 'Hiring',
  loan: 'Loan',
  medical: 'Medical',
};

const defaultRecommendations = [
  {
    title: 'Balance dataset representation',
    problem: 'Underrepresented groups may be driving biased model outcomes.',
    action: 'Audit current dataset composition and add representative samples from all demographic groups. Re-weight or resample rows to improve parity.',
    expectedImprovement: '10-18%',
  },
  {
    title: 'Strengthen sensitive feature checks',
    problem: 'Decisions may be overly influenced by gender, age, or race fields.',
    action: 'Remove direct sensitive attributes from model training inputs and introduce fairness-aware constraints during optimization.',
    expectedImprovement: '12-22%',
  },
  {
    title: 'Add fairness monitoring',
    problem: 'Bias metrics are not tracked over time.',
    action: 'Implement regular fairness dashboards, threshold alerts, and retraining triggers to maintain balanced performance.',
    expectedImprovement: '8-15%',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError('');

      try {
        const [analysisRes, reportsRes] = await Promise.all([
          api.get('/analysis/history'),
          api.get('/reports'),
        ]);

        setAnalyses(analysisRes.data?.analyses || []);
        setReports(reportsRes.data?.reports || []);
      } catch (err) {
        setError(err?.response?.data?.error || err.message || 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const filteredAnalyses = useMemo(() => {
    if (selectedDomain === 'all') return analyses;
    return analyses.filter((analysis) => analysis.domain === selectedDomain);
  }, [analyses, selectedDomain]);

  const totalAnalyses = analyses.length;
  const avgScore = totalAnalyses
    ? Math.round(analyses.reduce((sum, analysis) => sum + analysis.overallFairnessScore, 0) / totalAnalyses)
    : 0;
  const latestAnalysis = analyses[0] || null;
  const lowScoreCount = analyses.filter((analysis) => analysis.overallFairnessScore < 60).length;

  const domainCounts = useMemo(() => {
    return analyses.reduce(
      (acc, analysis) => {
        acc[analysis.domain] = (acc[analysis.domain] || 0) + 1;
        return acc;
      },
      { hiring: 0, loan: 0, medical: 0 }
    );
  }, [analyses]);

  const recentReports = reports.slice(0, 4);
  const recentAnalyses = filteredAnalyses.slice(0, 6);
  const suggestions = latestAnalysis?.recommendations?.length ? latestAnalysis.recommendations : defaultRecommendations;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-hero">
          <h1>FairLens AI Dashboard</h1>
          <p>Monitor fairness performance, review recent audits, and prioritize remediation across every analysis.</p>
        </header>

        <section className="dashboard-metrics">
          <div className="metric-card">
            <h3>{totalAnalyses}</h3>
            <p>Analyses completed</p>
          </div>
          <div className="metric-card">
            <h3>{avgScore}/100</h3>
            <p>Average fairness score</p>
          </div>
          <div className="metric-card">
            <h3>{reports.length}</h3>
            <p>Reports generated</p>
          </div>
          <div className="metric-card">
            <h3>{lowScoreCount}</h3>
            <p>High risk analyses</p>
          </div>
        </section>

        <section className="filter-section">
          <div className="filter-row">
            <div>
              <span className="filter-label">View by domain</span>
              <select value={selectedDomain} onChange={(event) => setSelectedDomain(event.target.value)}>
                {Object.entries(domainLabels).map(([key, label]) => (
                  <option value={key} key={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <button className="view-button" onClick={() => navigate('/analyze')}>
              Run a new analysis
            </button>
          </div>
        </section>

        {loading && (
          <div className="empty-state">
            <p>Loading your fairness dashboard...</p>
          </div>
        )}

        {error && (
          <div className="empty-state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="dashboard-widgets">
            <div className="dashboard-left">
              <section className="analysis-summary-card">
                <div className="section-header">
                  <h2>Latest analysis</h2>
                  <span className="subtitle">{latestAnalysis ? `Updated ${formatDate(latestAnalysis.createdAt)}` : 'No recent analysis yet'}</span>
                </div>

                {latestAnalysis ? (
                  <BiasResultCard analysis={latestAnalysis} />
                ) : (
                  <div className="empty-state">
                    <p>You have not completed an analysis yet. Start by uploading your dataset in Analyze.</p>
                  </div>
                )}
              </section>

              <section className="analyses-table">
                <div className="section-header">
                  <h2>Recent analyses</h2>
                  <span className="subtitle">Showing the latest {recentAnalyses.length} results</span>
                </div>

                {recentAnalyses.length === 0 ? (
                  <div className="empty-state">
                    <p>No results available for the selected domain.</p>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Dataset</th>
                        <th>Domain</th>
                        <th>Score</th>
                        <th>Severity</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAnalyses.map((analysis) => (
                        <tr key={analysis.id}>
                          <td>{analysis.datasetName}</td>
                          <td className="domain-cell">{domainLabels[analysis.domain] || analysis.domain}</td>
                          <td>
                            <span className="score">{analysis.overallFairnessScore}</span>
                          </td>
                          <td>
                            <span className={`severity severity-${analysis.severityLevel.toLowerCase()}`}>
                              {analysis.severityLevel}
                            </span>
                          </td>
                          <td>{formatDate(analysis.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
            </div>

            <div className="dashboard-right">
              <section className="recommendations-widget">
                <div className="section-header">
                  <h2>Actionable recommendations</h2>
                  <span className="subtitle">Based on your latest analysis</span>
                </div>
                <RecommendationPanel recommendations={suggestions} />
              </section>

              <section className="reports-panel">
                <div className="section-header">
                  <h2>Recent reports</h2>
                  <span className="subtitle">Audit history and generated summaries</span>
                </div>

                {recentReports.length === 0 ? (
                  <div className="empty-state">
                    <p>No reports created yet.</p>
                  </div>
                ) : (
                  <div className="reports-list">
                    {recentReports.map((report) => (
                      <div key={report.id} className="report-card">
                        <div>
                          <strong>{report.reportTitle}</strong>
                          <p>{domainLabels[report.domain] || report.domain}</p>
                        </div>
                        <div className="report-meta">
                          <span>{formatDate(report.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="domain-breakdown">
                <div className="section-header">
                  <h2>Analysis by domain</h2>
                  <span className="subtitle">Bias coverage across your workflows</span>
                </div>
                <div className="breakdown-grid">
                  <div className="breakdown-card">
                    <span>Hiring</span>
                    <strong>{domainCounts.hiring}</strong>
                  </div>
                  <div className="breakdown-card">
                    <span>Loan</span>
                    <strong>{domainCounts.loan}</strong>
                  </div>
                  <div className="breakdown-card">
                    <span>Medical</span>
                    <strong>{domainCounts.medical}</strong>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
