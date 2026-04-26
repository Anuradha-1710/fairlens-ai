const express = require('express');
const {
  analyzeDataset,
  getAnalysisHistory,
  getAnalysis,
  deleteAnalysis
} = require('../controllers/analysisController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateAnalysisInput } = require('../middleware/validateInput');

const router = express.Router();

router.post('/analyze', authenticate, validateAnalysisInput, analyzeDataset);
router.get('/history', authenticate, getAnalysisHistory);
router.get('/:id', authenticate, getAnalysis);
router.delete('/:id', authenticate, deleteAnalysis);

module.exports = router;
