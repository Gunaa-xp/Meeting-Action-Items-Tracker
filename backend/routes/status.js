const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', (_req, res) => {
  const database = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const llm =
    process.env.OPENAI_API_KEY || process.env.LLM_API_KEY || process.env.ANTHROPIC_API_KEY
      ? 'configured'
      : 'not_configured';

  res.json({
    backend: 'healthy',
    database,
    llm,
  });
});

module.exports = router;
