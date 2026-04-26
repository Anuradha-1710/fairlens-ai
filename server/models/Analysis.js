const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    domain: {
      type: String,
      enum: ['hiring', 'loan', 'medical'],
      required: true
    },
    datasetName: {
      type: String,
      required: true
    },
    rowCount: {
      type: Number,
      required: true
    },
    columnCount: {
      type: Number,
      required: true
    },
    sensitiveFieldsDetected: [
      {
        type: String
      }
    ],
    overallFairnessScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    severityLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true
    },
    biasBreakdown: [
      {
        attribute: String,
        biasScore: Number,
        pattern: String,
        affectedGroup: String,
        explanation: String
      }
    ],
    topDiscriminatoryPatterns: [String],
    recommendations: [
      {
        title: String,
        problem: String,
        action: String,
        expectedImprovement: String
      }
    ],
    summary: String,
    legalRisk: String,
    geminiRawResponse: String,
    dataPreview: mongoose.Schema.Types.Mixed,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
AnalysisSchema.index({ userId: 1, createdAt: -1 });
AnalysisSchema.index({ domain: 1 });

module.exports = mongoose.model('Analysis', AnalysisSchema);
