import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, ComposedChart, Line } from 'recharts';
import '../styles/Components.css';

export default function FairnessChart({ biasBreakdown }) {
  const chartData = biasBreakdown.map(bias => ({
    name: bias.attribute,
    bias: bias.biasScore,
    fairness: 100 - bias.biasScore
  }));

  // Grouped Bar Chart Data - Outcome Rate by Demographic Group
  const groupedBarData = biasBreakdown.length > 0 && biasBreakdown[0].groups
    ? Object.entries(biasBreakdown[0].groups).map(([group, rate]) => ({
        group,
        rate: rate
      }))
    : [];

  // Pie Chart Data - Bias Contribution by Attribute
  const pieData = biasBreakdown.map((bias, index) => ({
    name: bias.attribute || `Attribute ${index + 1}`,
    value: bias.biasScore,
    fill: `hsl(${index * 45}, 70%, 50%)`
  }));

  // Gauge Chart Data for Bias Score
  const gaugeData = [
    { name: 'Fair', value: Math.max(0, 100 - (biasBreakdown.length > 0 ? biasBreakdown[0].biasScore : 0)), fill: '#10B981' },
    { name: 'Medium', value: Math.min(30, biasBreakdown.length > 0 ? biasBreakdown[0].biasScore : 0), fill: '#F59E0B' },
    { name: 'Critical', value: Math.max(0, (biasBreakdown.length > 0 ? biasBreakdown[0].biasScore : 0) - 30), fill: '#EF4444' }
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="charts-container">
      {/* Grouped Bar Chart - Outcome Rate by Demographic Group */}
      {groupedBarData.length > 0 && (
        <div className="chart">
          <h3>Outcome Rate by Demographic Group</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groupedBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="group" />
              <YAxis label={{ value: 'Approval/Hire Rate %', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value}%`, 'Rate']} />
              <Legend />
              <Bar dataKey="rate" fill="#6366F1" name="Approval Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bias Score Gauge */}
      <div className="chart">
        <h3>Bias Score Gauge</h3>
        <div className="gauge-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {gaugeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="gauge-center">
            <div className="gauge-score">
              {biasBreakdown.length > 0 ? biasBreakdown[0].biasScore : 0}%
            </div>
            <div className="gauge-label">Bias Score</div>
          </div>
        </div>
        <div className="gauge-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#10B981' }}></span>
            <span>0-30% Fair</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#F59E0B' }}></span>
            <span>30-60% Medium</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#EF4444' }}></span>
            <span>60-100% Critical</span>
          </div>
        </div>
      </div>

      {/* Pie Chart - Bias Contribution by Attribute */}
      {pieData.length > 0 && (
        <div className="chart">
          <h3>Bias Contribution by Attribute</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

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
