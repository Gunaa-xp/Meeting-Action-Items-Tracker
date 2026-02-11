const express = require('express');
const {
  processTranscript,
  getTranscriptHistory,
} = require('../controllers/transcriptController');

const router = express.Router();

router.post('/process', processTranscript);
router.get('/history', getTranscriptHistory);

module.exports = router;
