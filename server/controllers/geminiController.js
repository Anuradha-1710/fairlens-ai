const { getGeminiModel } = require('../config/gemini');
const { buildDebiasPrompt, buildExplanationPrompt } = require('../utils/promptBuilder');

exports.getDebiasRecommendation = async (req, res, next) => {
  try {
    const { domain, recommendation } = req.body;

    if (!domain || !recommendation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = buildDebiasPrompt(domain, {}, recommendation);

    try {
      const model = getGeminiModel();
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      res.status(200).json({
        success: true,
        debiasGuide: response
      });
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      res.status(200).json({
        success: true,
        debiasGuide: `Implementation Guide for: ${recommendation.title}\n\n${recommendation.action}\n\nExpected fairness improvement: ${recommendation.expectedImprovement}`
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.explainPattern = async (req, res, next) => {
  try {
    const { domain, pattern } = req.body;

    if (!domain || !pattern) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = buildExplanationPrompt(domain, pattern);

    try {
      const model = getGeminiModel();
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      res.status(200).json({
        success: true,
        explanation: response
      });
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      res.status(200).json({
        success: true,
        explanation: `This discriminatory pattern "${pattern}" in ${domain} context reflects systemic bias that needs to be addressed through data collection, model design, and fairness constraints.`
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.generateInsights = async (req, res, next) => {
  try {
    const { domain, fairnessScore, patterns } = req.body;

    if (!domain || fairnessScore === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `As an AI fairness expert, provide a brief executive summary (3-4 sentences) about a ${domain} decision system with:
- Fairness Score: ${fairnessScore}/100
- Detected Patterns: ${patterns?.join(', ') || 'Multiple biases'}

Focus on business impact and next steps.`;

    try {
      const model = getGeminiModel();
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      res.status(200).json({
        success: true,
        insights: response
      });
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      const level = fairnessScore > 80 ? 'minimal' : fairnessScore > 60 ? 'moderate' : fairnessScore > 40 ? 'significant' : 'critical';
      res.status(200).json({
        success: true,
        insights: `Your ${domain} system shows ${level} bias with a fairness score of ${fairnessScore}/100. Immediate remediation is recommended through data balancing, fairness constraints, and ongoing monitoring.`
      });
    }
  } catch (error) {
    next(error);
  }
};
