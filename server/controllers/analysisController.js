const Analysis = require('../models/Analysis');
const User = require('../models/User');
const {
  detectSensitiveFields,
  calculateBiasMetrics,
  calculateOverallFairnessScore,
  determineSeverityLevel,
  extractDataSummary
} = require('../utils/biasCalculator');
const { buildBiasPrompt } = require('../utils/promptBuilder');
const { getGeminiModel } = require('../config/gemini');
const Papa = require('papaparse');

exports.analyzeDataset = async (req, res, next) => {
  try {
    const { domain, dataset, datasetName } = req.body;
    const userId = req.user.id;

    if (!domain || !dataset || !datasetName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['hiring', 'loan', 'medical'].includes(domain)) {
      return res.status(400).json({ error: 'Invalid domain' });
    }

    // Parse dataset
    let data = dataset;
    if (typeof dataset === 'string') {
      const parsed = Papa.parse(dataset, { header: true, skipEmptyLines: true });
      data = parsed.data;
    }

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty dataset' });
    }

    const columns = Object.keys(data[0]).filter(col => col.trim() !== '');
    const sensitiveFields = detectSensitiveFields(columns);

    if (sensitiveFields.length === 0) {
      return res.status(400).json({
        error: 'No sensitive attributes detected. Please include fields like gender, age, race, or religion.'
      });
    }

    const biasMetrics = calculateBiasMetrics(data, sensitiveFields);
    const overallFairnessScore = calculateOverallFairnessScore(biasMetrics);
    const severityLevel = determineSeverityLevel(overallFairnessScore);
    const datasetSummary = extractDataSummary(data, columns);
    const prompt = buildBiasPrompt(domain, datasetSummary, sensitiveFields, biasMetrics);

    // ✅ Gemini Call with retry on 429
    let geminiResponse = '';
    let geminiSuccess = false;

    const API_KEYS = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
    ].filter(Boolean);

    const { GoogleGenerativeAI } = require('@google/generative-ai');

    for (let i = 0; i < API_KEYS.length; i++) {
      try {
        console.log(`Trying Gemini key ${i + 1}...`);
        const genAI = new GoogleGenerativeAI(API_KEYS[i]);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        geminiResponse = result.response.text();
        geminiSuccess = true;
        console.log(`✅ Gemini key ${i + 1} worked!`);
        break;
      } catch (err) {
        console.error(`❌ Gemini key ${i + 1} failed:`, err.message);
        if (i === API_KEYS.length - 1) {
          console.log('All keys failed — using fallback');
        }
      }
    }

    // Fallback if all keys fail
    if (!geminiSuccess) {
      geminiResponse = JSON.stringify({
        overallFairnessScore,
        severityLevel,
        biasBreakdown: Object.entries(biasMetrics).map(([attr, metrics]) => ({
          attribute: attr,
          biasScore: metrics.biasScore,
          pattern: `Detected disparity in ${attr} with ratio of ${metrics.disparityRatio}`,
          affectedGroup: 'Minority/disadvantaged groups',
          explanation: `This attribute shows a disparity ratio of ${metrics.disparityRatio}, indicating potential bias in decision-making.`
        })),
        topDiscriminatoryPatterns: Object.keys(biasMetrics).map(
          attr => `${attr}-based discrimination detected`
        ),
        recommendations: [
          {
            title: 'Remove biased attributes from decision making',
            problem: `${sensitiveFields.join(', ')} fields show significant bias`,
            action: `1. Remove ${sensitiveFields.join(', ')} from model inputs\n2. Use blind review process\n3. Audit historical decisions`,
            expectedImprovement: '25-40%'
          },
          {
            title: 'Implement fairness constraints',
            problem: 'Model optimizes accuracy over fairness',
            action: '1. Define demographic parity metric\n2. Add fairness constraint\n3. Retrain model',
            expectedImprovement: '20-30%'
          }
        ],
        summary: `This ${domain} dataset shows a ${severityLevel} level of bias with an overall fairness score of ${overallFairnessScore}/100. Sensitive fields: ${sensitiveFields.join(', ')}.`,
        legalRisk: severityLevel === 'Critical' ? 'Critical' : severityLevel === 'High' ? 'High' : 'Medium'
      });
    }

    // Parse Gemini response
    let analysisResult;
    try {
      let cleanedResponse = geminiResponse;
      if (cleanedResponse.includes('```json')) {
        cleanedResponse = cleanedResponse.split('```json')[1].split('```')[0];
      } else if (cleanedResponse.includes('```')) {
        cleanedResponse = cleanedResponse.split('```')[1].split('```')[0];
      }
      analysisResult = JSON.parse(cleanedResponse.trim());
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      analysisResult = {
        overallFairnessScore,
        severityLevel,
        biasBreakdown: Object.entries(biasMetrics).map(([attr, metrics]) => ({
          attribute: attr,
          biasScore: metrics.biasScore,
          pattern: `Detected disparity in ${attr}`,
          affectedGroup: 'Affected groups',
          explanation: `Bias score: ${metrics.biasScore}%`
        })),
        recommendations: [],
        summary: `Fairness score: ${overallFairnessScore}/100`,
        legalRisk: 'Unknown'
      };
    }

    // Save to MongoDB
    const analysis = await Analysis.create({
      userId,
      domain,
      datasetName,
      rowCount: data.length,
      columnCount: columns.length,
      sensitiveFieldsDetected: sensitiveFields,
      overallFairnessScore: analysisResult.overallFairnessScore || overallFairnessScore,
      severityLevel: analysisResult.severityLevel || severityLevel,
      biasBreakdown: analysisResult.biasBreakdown || [],
      topDiscriminatoryPatterns: analysisResult.topDiscriminatoryPatterns || [],
      recommendations: analysisResult.recommendations || [],
      summary: analysisResult.summary || '',
      legalRisk: analysisResult.legalRisk || '',
      geminiRawResponse: geminiResponse,
      dataPreview: {
        columns,
        sampleRows: data.slice(0, 5)
      }
    });

    // Update user count
    try {
      await User.findByIdAndUpdate(userId, { $inc: { analysisCount: 1 } });
    } catch (e) {
      console.log('User count update skipped');
    }

    res.status(201).json({
      success: true,
      analysis: {
        id: analysis._id,
        domain,
        datasetName,
        overallFairnessScore: analysis.overallFairnessScore,
        severityLevel: analysis.severityLevel,
        biasBreakdown: analysis.biasBreakdown,
        topDiscriminatoryPatterns: analysis.topDiscriminatoryPatterns,
        recommendations: analysis.recommendations,
        summary: analysis.summary,
        legalRisk: analysis.legalRisk,
        createdAt: analysis.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnalysisHistory = async (req, res, next) => {
  try {
    const { domain, limit = 10, skip = 0 } = req.query;
    const userId = req.user.id;

    let query = { userId };
    if (domain && ['hiring', 'loan', 'medical'].includes(domain)) {
      query.domain = domain;
    }

    const analyses = await Analysis.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Analysis.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      count: analyses.length,
      analyses: analyses.map(a => ({
        id: a._id,
        domain: a.domain,
        datasetName: a.datasetName,
        overallFairnessScore: a.overallFairnessScore,
        severityLevel: a.severityLevel,
        rowCount: a.rowCount,
        createdAt: a.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    if (analysis.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      analysis
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    if (analysis.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Analysis.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Analysis deleted'
    });
  } catch (error) {
    next(error);
  }
};