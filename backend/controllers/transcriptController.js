const { ActionItem } = require('../models/ActionItem');
const Transcript = require('../models/Transcript');
const { parseTranscript } = require('../utils/transcriptParser');

const processTranscript = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Transcript text is required.' });
    }

    const extractedCandidates = parseTranscript(text);

    const insertedItems = extractedCandidates.length
      ? await ActionItem.insertMany(extractedCandidates)
      : [];

    const transcript = await Transcript.create({
      text,
      extractedItems: insertedItems.map((item) => item._id),
    });

    const count = await Transcript.countDocuments();
    if (count > 5) {
      const oldRecords = await Transcript.find().sort({ createdAt: 1 }).limit(count - 5);
      if (oldRecords.length > 0) {
        await Transcript.deleteMany({ _id: { $in: oldRecords.map((record) => record._id) } });
      }
    }

    const response = await transcript.populate('extractedItems');

    return res.status(201).json({
      transcript: response,
      extractedItems: response.extractedItems,
    });
  } catch (error) {
    next(error);
  }
};

const getTranscriptHistory = async (_req, res, next) => {
  try {
    const transcripts = await Transcript.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('extractedItems');

    res.json(transcripts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processTranscript,
  getTranscriptHistory,
};
