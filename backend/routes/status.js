const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', (_req, res) => {
  const database = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const llm = process.env.GEMINI_API_KEY ? 'configured' : 'not_configured';

  res.json({
    backend: 'healthy',
    database,
    llm,
  });
});

module.exports = router;
