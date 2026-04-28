const detectSensitiveFields = (columns) => {
  const sensitivePatterns = [
    /gender|sex|male|female/i,
    /race|ethnicity|color|origin/i,
    /age|birthday|birth_date/i,
    /religion|faith/i,
    /national|citizenship/i,
    /disability|handicap/i,
    /sexual|orientation/i,
    /region|location|zip|state|city/i,
    /insurance|economic|income|salary/i,
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

const detectBiasTypes = (columns) => {
  const biasTypes = {
    gender: /gender|sex|male|female/i,
    age: /age|birthday|birth_date/i,
    race: /race|ethnicity|color|origin/i,
    region: /region|location|zip|state|city/i,
    economic: /insurance|economic|income|salary/i,
  };

  const detected = {};
  columns.forEach(col => {
    Object.entries(biasTypes).forEach(([type, pattern]) => {
      if (pattern.test(col)) {
        detected[type] = col;
      }
    });
  });

  return detected;
};

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

    // Calculate rates per group
    const rates = {};
    Object.entries(groups).forEach(([group, stats]) => {
      rates[group] = stats.count > 0 ? (stats.positive_outcomes / stats.count) * 100 : 0;
    });

    // Find dominant and minority groups
    const sortedGroups = Object.entries(rates).sort((a, b) => b[1] - a[1]);
    const dominantGroup = sortedGroups[0];
    const minorityGroup = sortedGroups[sortedGroups.length - 1];

    // Bias Score = |% dominant group outcomes - % minority group outcomes|
    const biasScore = Math.abs(dominantGroup[1] - minorityGroup[1]);

    // Demographic Parity Difference
    const demographicParityDifference = Math.abs(dominantGroup[1] - minorityGroup[1]);

    // Disparate Impact Ratio = minority_rate / majority_rate
    const disparateImpactRatio = dominantGroup[1] > 0 ? minorityGroup[1] / dominantGroup[1] : 0;

    // Statistical Significance (simple sample size check)
    const totalSamples = Object.values(groups).reduce((sum, g) => sum + g.count, 0);
    const statisticalSignificance = totalSamples >= 30 ? 'High' : totalSamples >= 10 ? 'Medium' : 'Low';

    // Determine bias type
    const biasTypeMap = {
      gender: 'Gender Bias',
      age: 'Age Bias',
      race: 'Race/Ethnicity Bias',
      region: 'Region/Location Bias',
      economic: 'Insurance/Economic Bias'
    };

    const biasType = Object.keys(detectBiasTypes([field]))[0] || 'Unknown';
    const biasTypeName = biasTypeMap[biasType] || 'General Bias';

    metrics[field] = {
      biasType: biasTypeName,
      biasScore: Math.round(biasScore),
      demographicParityDifference: Math.round(demographicParityDifference),
      disparateImpactRatio: Math.round(disparateImpactRatio * 100) / 100,
      statisticalSignificance,
      dominantGroup: {
        name: dominantGroup[0],
        rate: Math.round(dominantGroup[1])
      },
      minorityGroup: {
        name: minorityGroup[0],
        rate: Math.round(minorityGroup[1])
      },
      groups: Object.fromEntries(Object.entries(rates).map(([g, r]) => [g, Math.round(r)])),
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
  detectBiasTypes,
  calculateBiasMetrics,
  calculateOverallFairnessScore,
  determineSeverityLevel,
  extractDataSummary
};