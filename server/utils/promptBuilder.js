const buildBiasPrompt = (domain, datasetSummary, sensitiveFields, biasMetrics) => {
  const domainContext = {
    hiring: 'HR hiring decisions - analyzing discrimination in candidate selection',
    loan: 'Bank loan approval decisions - analyzing discriminatory lending practices',
    medical: 'Medical treatment decisions - analyzing healthcare disparities'
  };

  const biasDetails = Object.entries(biasMetrics).map(([field, metrics]) => {
    return `
    Field: ${field}
    - Bias Score: ${metrics.biasScore}/100
    - Disparity Ratio: ${metrics.disparityRatio}
    - Groups Found: ${JSON.stringify(metrics.groups || {})}
    - Outcome Distribution: ${JSON.stringify(metrics.outcomeDistribution || {})}
    `;
  }).join('\n');

  return `You are a world-class AI Fairness and Bias Detection Expert.

DOMAIN: ${domain} (${domainContext[domain] || 'General'})

DATASET DETAILS:
- Total Records: ${datasetSummary.totalRows}
- All Columns: ${datasetSummary.columns.join(', ')}
- Sensitive Attributes Found: ${sensitiveFields.join(', ')}

ACTUAL DATA SAMPLE (real rows from dataset):
${JSON.stringify(datasetSummary.rowSample, null, 2)}

STATISTICAL BIAS ANALYSIS (calculated from real data):
${biasDetails}

IMPORTANT INSTRUCTIONS:
1. Analyze the ACTUAL data sample above carefully
2. Give SPECIFIC recommendations based on THIS dataset only
3. Mention SPECIFIC column names: ${datasetSummary.columns.join(', ')}
4. Give SPECIFIC numbers and percentages from the actual data
5. Do NOT give generic recommendations
6. Each recommendation MUST reference actual fields: ${sensitiveFields.join(', ')}
7. Look at the data sample and find REAL patterns

RESPOND WITH ONLY THIS EXACT JSON (no markdown, no backticks, pure JSON only):
{
  "overallFairnessScore": <number 0-100 where 100 is perfectly fair>,
  "severityLevel": "<Low|Medium|High|Critical>",
  "biasBreakdown": [
    {
      "attribute": "<exact field name from dataset>",
      "biasScore": <0-100>,
      "pattern": "<specific pattern found in THIS dataset with numbers>",
      "affectedGroup": "<specific group name from actual data>",
      "explanation": "<specific explanation with actual numbers from data>"
    }
  ],
  "topDiscriminatoryPatterns": [
    "<specific pattern 1 with actual field names and numbers>",
    "<specific pattern 2 with actual field names and numbers>",
    "<specific pattern 3 with actual field names and numbers>"
  ],
  "recommendations": [
    {
      "title": "<specific action for THIS dataset>",
      "problem": "<specific bias found in ${sensitiveFields.join('/')} field with numbers>",
      "action": "<exact steps mentioning actual column names from this dataset>",
      "expectedImprovement": "<specific % based on current bias scores>"
    }
  ],
  "summary": "<2-3 sentences with specific numbers and field names from THIS dataset>",
  "legalRisk": "<Low|Medium|High|Critical>"
}`;
};

const buildDebiasPrompt = (domain, analysisData, selectedRecommendation) => {
  return `You are an AI Fairness expert. The user accepted this debiasing recommendation:

DOMAIN: ${domain}
RECOMMENDATION: ${selectedRecommendation.title}
PROBLEM: ${selectedRecommendation.problem}
PROPOSED ACTION: ${selectedRecommendation.action}

Provide a detailed implementation guide:
1. Step-by-step technical implementation
2. Data preprocessing changes needed
3. Fairness constraints to add to model
4. Monitoring metrics to track post-implementation
5. Success criteria to validate the fix

Keep response under 500 words, technical but accessible.`;
};

const buildExplanationPrompt = (domain, pattern) => {
  return `As an AI ethics expert, explain why this discriminatory pattern is harmful in the context of ${domain}:

PATTERN: ${pattern}

Provide:
1. Why this pattern exists (often in historical data)
2. How it perpetuates discrimination
3. Real-world impact on affected groups
4. Legal/ethical implications

Keep response under 300 words, clear and non-technical.`;
};

module.exports = {
  buildBiasPrompt,
  buildDebiasPrompt,
  buildExplanationPrompt
};