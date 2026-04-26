const detectSensitiveFields = (columns) => {
  const sensitivePatterns = [
    /gender|sex|male|female/i,
    /race|ethnicity|color|origin/i,
    /age|birthday|birth_date/i,
    /religion|faith/i,
    /national|citizenship/i,
    /disability|handicap/i,
    /sexual|orientation/i,
  ];

  const detected = [];
  columns.forEach(col => {
    sensitivePatterns.forEach(pattern => {
      if (pattern.test(col) && !detected.includes(col)) {
        detected.push(col);
      }
    });
  });

  return detected;
};

// ✅ FIXED — outcome detection sahi hai ab
const calculateBiasMetrics = (data, sensitiveFields) => {
  const metrics = {};

  // Find outcome column automatically
  const outcomeKeywords = ['hired', 'approved', 'loan_approved', 'outcome', 'accepted', 'selected', 'result', 'decision', 'treatment_recommended'];
  const columns = Object.keys(data[0] || {});
  
  let outcomeColumn = null;
  columns.forEach(col => {
    if (outcomeKeywords.some(kw => col.toLowerCase().includes(kw))) {
      outcomeColumn = col;
    }
  });

  const positiveValues = ['yes', 'good', 'approved', 'hired', 'accepted', 'advanced', 'selected', '1', 'true'];

  sensitiveFields.forEach(field => {
    const groups = {};

    data.forEach(row => {
      const value = String(row[field] || 'unknown').toLowerCase().trim();
      
      if (!groups[value]) {
        groups[value] = { count: 0, positive_outcomes: 0 };
      }
      groups[value].count++;

      // Check outcome column
      if (outcomeColumn) {
        const outcomeVal = String(row[outcomeColumn] || '').toLowerCase().trim();
        if (positiveValues.some(pv => outcomeVal.includes(pv))) {
          groups[value].positive_outcomes++;
        }
      }
    });

    // Calculate approval rates per group
    const rates = {};
    let maxRate = 0;
    let minRate = 100;

    Object.entries(groups).forEach(([group, stats]) => {
      const rate = stats.count > 0
        ? Math.round((stats.positive_outcomes / stats.count) * 100)
        : 0;
      rates[group] = rate;
      maxRate = Math.max(maxRate, rate);
      minRate = Math.min(minRate, rate);
    });

    const disparityRatio = maxRate > 0 ? minRate / maxRate : 1;
    const biasScore = Math.round(Math.max(0, Math.min(100, (1 - disparityRatio) * 100)));

    metrics[field] = {
      biasScore,
      disparityRatio: Math.round(disparityRatio * 100) / 100,
      groups: rates,
      outcomeColumn,
      totalRecords: data.length,
      outcomeDistribution: Object.fromEntries(
        Object.entries(groups).map(([g, s]) => [
          g,
          `${s.positive_outcomes}/${s.count} positive outcomes (${Math.round((s.positive_outcomes/s.count)*100)}%)`
        ])
      )
    };
  });

  return metrics;
};

const calculateOverallFairnessScore = (biasMetrics) => {
  if (Object.keys(biasMetrics).length === 0) return 50;
  const scores = Object.values(biasMetrics).map(m => m.biasScore);
  const avgBias = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(100 - avgBias);
};

const determineSeverityLevel = (fairnessScore) => {
  if (fairnessScore >= 80) return 'Low';
  if (fairnessScore >= 60) return 'Medium';
  if (fairnessScore >= 40) return 'High';
  return 'Critical';
};

const extractDataSummary = (data, columns, limit = 10) => {
  const summary = {
    totalRows: data.length,
    columns,
    columnCount: columns.length,
    rowSample: data.slice(0, limit)
  };

  const stats = {};
  columns.forEach(col => {
    const values = data.map(row => row[col]);
    const numericValues = values.filter(v => !isNaN(v) && v !== '');

    if (numericValues.length > values.length / 2) {
      const nums = numericValues.map(Number);
      stats[col] = {
        type: 'numeric',
        min: Math.min(...nums),
        max: Math.max(...nums),
        avg: Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
      };
    } else {
      const uniqueVals = [...new Set(values.map(v => String(v)))];
      const valueCounts = {};
      values.forEach(v => {
        const key = String(v);
        valueCounts[key] = (valueCounts[key] || 0) + 1;
      });
      stats[col] = {
        type: 'categorical',
        uniqueValues: uniqueVals.slice(0, 10),
        valueCounts
      };
    }
  });

  summary.statistics = stats;
  return summary;
};

module.exports = {
  detectSensitiveFields,
  calculateBiasMetrics,
  calculateOverallFairnessScore,
  determineSeverityLevel,
  extractDataSummary
};