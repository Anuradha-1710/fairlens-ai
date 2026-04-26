 
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import api from "../utils/api";

const severityColor = {
  Low: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/40" },
  Medium: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/40" },
  High: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/40" },
  Critical: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/40" },
};

function ScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#10B981" : score >= 40 ? "#F59E0B" : "#EF4444";
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="130" height="130" className="-rotate-90">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#1E293B" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        <p className="text-xs text-slate-400 mt-0.5">/ 100</p>
      </div>
    </div>
  );
}

function ProgressBar({ label, score, affectedGroup }) {
  const color = score >= 70 ? "bg-red-500" : score >= 40 ? "bg-yellow-500" : "bg-green-500";
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-slate-300 font-medium capitalize">{label}</span>
        <span className="text-sm text-slate-400">{score}/100 bias</span>
      </div>
      <div className="w-full bg-[#0F172A] rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
      {affectedGroup && (
        <p className="text-xs text-slate-500 mt-1">Affected: {affectedGroup}</p>
      )}
    </div>
  );
}

export default function Report() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchAnalysis();
  }, [id, user]);

  async function fetchAnalysis() {
    setLoading(true);
    try {
      const res = await api.get(`/analysis/${id}`);
      setAnalysis(res.data.data);
    } catch (err) {
      setError("Report not found or you don't have access.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadPDF() {
    setDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.setTextColor(99, 102, 241);
      doc.text("FairLens AI — Fairness Audit Report", 20, 20);

      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
      doc.text(`Domain: ${analysis.domain?.toUpperCase()}`, 20, 38);
      doc.text(`Dataset: ${analysis.datasetName || "Unnamed"}`, 20, 46);
      doc.text(`Rows: ${analysis.rowCount || 0} | Columns: ${analysis.columnCount || 0}`, 20, 54);

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`Overall Fairness Score: ${analysis.overallFairnessScore}/100`, 20, 68);
      doc.text(`Severity Level: ${analysis.severityLevel}`, 20, 78);

      doc.setFontSize(12);
      doc.text("Summary:", 20, 92);
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const summaryLines = doc.splitTextToSize(analysis.summary || "N/A", 170);
      doc.text(summaryLines, 20, 100);

      let yPos = 100 + summaryLines.length * 6 + 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Bias Breakdown:", 20, yPos);
      yPos += 8;

      analysis.biasBreakdown?.forEach((item) => {
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(`• ${item.attribute}: Bias Score ${item.biasScore}/100`, 20, yPos);
        yPos += 6;
        const lines = doc.splitTextToSize(`  ${item.explanation}`, 165);
        doc.text(lines, 22, yPos);
        yPos += lines.length * 5 + 4;
        if (yPos > 270) { doc.addPage(); yPos = 20; }
      });

      yPos += 6;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Recommendations:", 20, yPos);
      yPos += 8;

      analysis.recommendations?.forEach((rec, i) => {
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(`${i + 1}. ${rec.title}`, 20, yPos);
        yPos += 5;
        const actionLines = doc.splitTextToSize(`Action: ${rec.action}`, 165);
        doc.text(actionLines, 22, yPos);
        yPos += actionLines.length * 5 + 3;
        if (yPos > 270) { doc.addPage(); yPos = 20; }
      });

      doc.save(`FairLens_Report_${analysis.datasetName || id}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const sev = severityColor[analysis?.severityLevel] || severityColor.Low;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            ← Back
          </button>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-bold">F</div>
            <span className="font-semibold">FairLens AI</span>
          </div>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          {downloading ? "Generating..." : "⬇ Download PDF"}
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-3xl font-bold">Fairness Audit Report</h1>
            <span className={`text-sm px-3 py-1 rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}>
              {analysis.severityLevel} Risk
            </span>
          </div>
          <p className="text-slate-400">
            {analysis.domain?.toUpperCase()} · {analysis.datasetName || "Unnamed Dataset"} ·{" "}
            {new Date(analysis.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric"
            })}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1E293B] rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center gap-3">
            <p className="text-slate-400 text-sm">Overall Fairness Score</p>
            <ScoreRing score={analysis.overallFairnessScore || 0} />
            <p className="text-xs text-slate-500">
              {analysis.overallFairnessScore >= 70 ? "✅ Relatively Fair"
                : analysis.overallFairnessScore >= 40 ? "⚠️ Moderate Bias Detected"
                : "🚨 Severe Bias Detected"}
            </p>
          </div>
          <div className="bg-[#1E293B] rounded-2xl p-6 border border-white/5">
            <h3 className="font-semibold mb-3 text-slate-200">AI Summary</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">{analysis.summary || "No summary available."}</p>
            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-slate-500 mb-1">Legal Risk Assessment</p>
              <p className="text-sm text-orange-400">{analysis.legalRisk || "N/A"}</p>
            </div>
          </div>
        </div>

        {analysis.biasBreakdown?.length > 0 && (
          <div className="bg-[#1E293B] rounded-2xl p-6 border border-white/5 mb-6">
            <h3 className="font-semibold mb-6 text-slate-200">Bias Breakdown</h3>
            {analysis.biasBreakdown.map((item) => (
              <div key={item.attribute} className="mb-6 last:mb-0">
                <ProgressBar label={item.attribute} score={item.biasScore} affectedGroup={item.affectedGroup} />
                <div className="bg-[#0F172A] rounded-lg p-3 mt-2">
                  <p className="text-xs text-slate-400 mb-1">
                    <span className="text-slate-300 font-medium">Pattern: </span>{item.pattern}
                  </p>
                  <p className="text-xs text-slate-400">
                    <span className="text-slate-300 font-medium">Explanation: </span>{item.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {analysis.recommendations?.length > 0 && (
          <div className="bg-[#1E293B] rounded-2xl p-6 border border-white/5 mb-6">
            <h3 className="font-semibold mb-4 text-slate-200">✅ Recommendations</h3>
            <div className="space-y-4">
              {analysis.recommendations.map((rec, i) => (
                <div key={i} className="bg-[#0F172A] rounded-xl p-4 border border-white/5">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm mb-2">{rec.title}</h4>
                      <p className="text-xs text-slate-400 mb-1"><span className="text-red-400 font-medium">Problem: </span>{rec.problem}</p>
                      <p className="text-xs text-slate-400 mb-1"><span className="text-green-400 font-medium">Action: </span>{rec.action}</p>
                      <p className="text-xs text-slate-400"><span className="text-indigo-400 font-medium">Expected Improvement: </span>{rec.expectedImprovement}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center text-slate-500 text-sm py-4">
          Report generated by FairLens AI · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}