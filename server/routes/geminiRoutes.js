const express = require('express');
const {
  getDebiasRecommendation,
  explainPattern,
  generateInsights
} = require('../controllers/geminiController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/debias', authenticate, getDebiasRecommendation);
router.post('/explain-pattern', authenticate, explainPattern);
router.post('/insights', authenticate, generateInsights);

module.exports = router;
