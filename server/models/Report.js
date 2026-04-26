const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analysis',
      required: true
    },
    reportTitle: {
      type: String,
      required: true
    },
    reportContent: mongoose.Schema.Types.Mixed,
    reportUrl: String,
    shareableLink: {
      type: String,
      unique: true,
      default: () => uuidv4()
    },
    downloadCount: {
      type: Number,
      default: 0
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 2592000 // Auto-delete after 30 days
    }
  },
  { timestamps: true }
);

// Index for faster lookups
ReportSchema.index({ userId: 1, createdAt: -1 });
ReportSchema.index({ shareableLink: 1 });

module.exports = mongoose.model('Report', ReportSchema);
