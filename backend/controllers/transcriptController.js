const { ActionItem } = require('../models/ActionItem');
const Transcript = require('../models/Transcript');
const { parseTranscript } = require('../utils/transcriptParser');
const { extractActionItemsWithGemini } = require('../utils/geminiParser');


const normalizeGeminiItems = (items = []) => {
  return items
    .filter((item) => item && typeof item.task === 'string' && item.task.trim())
    .map((item) => {
      let dueDate = null;
      if (typeof item.dueDate === 'string' && item.dueDate.trim()) {
        const parsed = new Date(item.dueDate.trim());
        if (!Number.isNaN(parsed.getTime())) {
          dueDate = parsed;
        }
      }

      return {
        task: item.task.trim(),
        owner: typeof item.owner === 'string' && item.owner.trim() ? item.owner.trim() : null,
        dueDate,
        status: 'open',
        tags: [],
        stepType: 'Other',
      };
    });
};

const processTranscript = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Transcript text is required' });
    }

    let extractedCandidates = [];

    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiItems = await extractActionItemsWithGemini(text);
        const normalizedGeminiItems = normalizeGeminiItems(geminiItems);

        if (normalizedGeminiItems.length > 0) {
          extractedCandidates = normalizedGeminiItems;
        } else {
          extractedCandidates = parseTranscript(text);
        }
      } catch (error) {
        console.error('Falling back to regex parser after Gemini error:', error.message);
        extractedCandidates = parseTranscript(text);
      }
    } else {
      extractedCandidates = parseTranscript(text);
    }

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
