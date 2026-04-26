import React, { useState } from 'react';
import toast from 'react-hot-toast';
import '../styles/Components.css';

export default function AuditReportModal({ analysis, onClose }) {
  const [reportTitle, setReportTitle] = useState(
    `${analysis.domain} - Fairness Audit ${new Date().toLocaleDateString()}`
  );
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!reportTitle.trim()) {
      toast.error('Please enter a report title');
      return;
    }

    setGenerating(true);
    try {
      // In production, this would call the backend to generate PDF
      // const response = await api.post('/reports/generate', {
      //   analysisId: analysis.id,
      //   reportTitle
      // });
      
      // Simulate report generation
      toast.success('Report generated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📄 Generate Audit Report</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Report Title</label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="Enter report title"
            />
          </div>

          <div className="report-summary">
            <h3>Report includes:</h3>
            <ul>
              <li>✅ Dataset summary and statistics</li>
              <li>✅ Fairness score: {analysis.overallFairnessScore}/100</li>
              <li>✅ Bias breakdown by attribute</li>
              <li>✅ AI-powered recommendations</li>
              <li>✅ Legal risk assessment</li>
              <li>✅ Timestamp and shareability link</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="generate-btn"
            onClick={handleGenerateReport}
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate & Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
