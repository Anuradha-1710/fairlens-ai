import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import '../styles/Components.css';

export default function FairnessChart({ biasBreakdown }) {
  const chartData = biasBreakdown.map(bias => ({
    name: bias.attribute,
    bias: bias.biasScore,
    fairness: 100 - bias.biasScore
  }));

  return (
    <div className="charts-container">
      <div className="chart">
        <h3>Bias Score by Attribute</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="bias" fill="#EF4444" name="Bias Score" />
            <Bar dataKey="fairness" fill="#10B981" name="Fairness Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart">
        <h3>Fairness Radar</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar name="Fairness" dataKey="fairness" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            <Radar name="Bias" dataKey="bias" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="bias-breakdown-list">
        <h3>Detailed Breakdown</h3>
        {biasBreakdown.map((bias, idx) => (
          <div key={idx} className="bias-item">
            <div className="bias-header">
              <strong>{bias.attribute}</strong>
              <span className="bias-score">Bias: {bias.biasScore}%</span>
            </div>
            <p className="pattern">{bias.pattern}</p>
            <p className="affected">Affected Group: {bias.affectedGroup}</p>
            <p className="explanation">{bias.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
