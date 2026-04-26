const Report = require('../models/Report');
const Analysis = require('../models/Analysis');
const jsPDF = require('jspdf');

exports.generateReport = async (req, res, next) => {
  try {
    const { analysisId, reportTitle } = req.body;
    const userId = req.user.id;

    if (!analysisId) {
      return res.status(400).json({ error: 'Missing analysisId' });
    }

    // Get analysis
    const analysis = await Analysis.findById(analysisId);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    if (analysis.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Create report document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.text('FairLens AI - Fairness Audit Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    doc.setFontSize(10);
    doc.text(`Report Title: ${reportTitle || analysis.datasetName}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Domain: ${analysis.domain.charAt(0).toUpperCase() + analysis.domain.slice(1)}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 10;

    // Executive Summary
    doc.setFontSize(14);
    doc.text('Executive Summary', 20, yPosition);
    yPosition += 8;
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(analysis.summary || 'See detailed analysis below', pageWidth - 40);
    doc.text(summaryLines, 20, yPosition);
    yPosition += summaryLines.length * 5 + 5;

    // Overall Fairness Score
    doc.setFontSize(14);
    doc.text('Overall Fairness Score', 20, yPosition);
    yPosition += 8;
    doc.setFontSize(12);
    doc.text(`${analysis.overallFairnessScore}/100 (${analysis.severityLevel} Severity)`, 20, yPosition);
    yPosition += 10;

    // Dataset Summary
    doc.setFontSize(14);
    doc.text('Dataset Summary', 20, yPosition);
    yPosition += 8;
    doc.setFontSize(10);
    doc.text(`Rows: ${analysis.rowCount} | Columns: ${analysis.columnCount}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Sensitive Fields: ${analysis.sensitiveFieldsDetected.join(', ')}`, 20, yPosition);
    yPosition += 10;

    // Bias Breakdown
    if (yPosition + 30 > pageHeight) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(14);
    doc.text('Bias Breakdown by Attribute', 20, yPosition);
    yPosition += 8;

    analysis.biasBreakdown.forEach(bias => {
      if (yPosition + 15 > pageHeight) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(10);
      doc.setTextColor(200);
      doc.text(`${bias.attribute} (Score: ${bias.biasScore}/100)`, 20, yPosition);
      yPosition += 5;
      doc.setTextColor(0);
      const patternLines = doc.splitTextToSize(`Pattern: ${bias.pattern}`, pageWidth - 40);
      doc.text(patternLines, 25, yPosition);
      yPosition += patternLines.length * 4;
      doc.text(`Affected: ${bias.affectedGroup}`, 25, yPosition);
      yPosition += 5;
    });

    yPosition += 5;

    // Recommendations
    if (yPosition + 30 > pageHeight) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(14);
    doc.text('Debiasing Recommendations', 20, yPosition);
    yPosition += 8;

    analysis.recommendations.slice(0, 5).forEach((rec, idx) => {
      if (yPosition + 20 > pageHeight) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`${idx + 1}. ${rec.title}`, 20, yPosition);
      yPosition += 5;
      doc.setTextColor(0);
      doc.text(`Action: ${rec.action.split('\n')[0]}`, 25, yPosition);
      yPosition += 5;
      doc.text(`Expected Improvement: ${rec.expectedImprovement}`, 25, yPosition);
      yPosition += 8;
    });

    // Legal Risk
    if (yPosition + 15 > pageHeight) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(14);
    doc.text('Legal & Compliance Risk Assessment', 20, yPosition);
    yPosition += 8;
    doc.setFontSize(10);
    doc.text(`Risk Level: ${analysis.legalRisk}`, 20, yPosition);

    const pdfBuffer = doc.output('arraybuffer');

    // Save report to database
    const report = await Report.create({
      userId,
      analysisId,
      reportTitle: reportTitle || `${analysis.domain} Report - ${new Date().toLocaleDateString()}`,
      reportContent: {
        overallFairnessScore: analysis.overallFairnessScore,
        severityLevel: analysis.severityLevel,
        summary: analysis.summary,
        biasBreakdown: analysis.biasBreakdown,
        recommendations: analysis.recommendations,
        legalRisk: analysis.legalRisk
      },
      isPublic: false
    });

    res.status(201).json({
      success: true,
      report: {
        id: report._id,
        reportTitle: report.reportTitle,
        shareableLink: report.shareableLink,
        createdAt: report.createdAt
      },
      pdfUrl: `/api/v1/reports/download/${report._id}`
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserReports = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const reports = await Report.find({ userId })
      .populate('analysisId', 'domain datasetName overallFairnessScore')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports: reports.map(r => ({
        id: r._id,
        reportTitle: r.reportTitle,
        domain: r.analysisId?.domain,
        datasetName: r.analysisId?.datasetName,
        shareableLink: r.shareableLink,
        downloadCount: r.downloadCount,
        createdAt: r.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

exports.shareReport = async (req, res, next) => {
  try {
    const { reportId } = req.body;
    const userId = req.user.id;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (report.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    report.isPublic = !report.isPublic;
    await report.save();

    res.status(200).json({
      success: true,
      isPublic: report.isPublic,
      shareableLink: report.shareableLink
    });
  } catch (error) {
    next(error);
  }
};

exports.getPublicReport = async (req, res, next) => {
  try {
    const { shareableLink } = req.params;

    const report = await Report.findOne({ shareableLink, isPublic: true })
      .populate('analysisId')
      .populate('userId', 'name organization');

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    report.downloadCount += 1;
    await report.save();

    res.status(200).json({
      success: true,
      report: {
        id: report._id,
        reportTitle: report.reportTitle,
        reportContent: report.reportContent,
        analysis: report.analysisId,
        author: report.userId?.organization || 'Anonymous',
        createdAt: report.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReport = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const userId = req.user.id;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (report.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Report.findByIdAndDelete(reportId);

    res.status(200).json({
      success: true,
      message: 'Report deleted'
    });
  } catch (error) {
    next(error);
  }
};
