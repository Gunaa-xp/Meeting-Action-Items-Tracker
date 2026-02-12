const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const actionRoutes = require('./routes/actionRoutes');
const transcriptRoutes = require('./routes/transcriptRoutes');
const statusRoutes = require('./routes/status');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ message: 'Meeting Action Items Tracker API is running.' });
});

app.use('/api/actions', actionRoutes);
app.use('/api/transcripts', transcriptRoutes);
app.use('/api/status', statusRoutes);

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
});

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not configured.');
    }

    await mongoose.connect(process.env.MONGO_URI);
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
