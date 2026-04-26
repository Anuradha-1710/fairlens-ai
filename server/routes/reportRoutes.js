const express = require('express');
const {
  generateReport,
  getUserReports,
  shareReport,
  getPublicReport,
  deleteReport
} = require('../controllers/reportController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate', authenticate, generateReport);
router.get('/', authenticate, getUserReports);
router.post('/share', authenticate, shareReport);
router.get('/public/:shareableLink', getPublicReport);
router.delete('/:reportId', authenticate, deleteReport);

module.exports = router;
