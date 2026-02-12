const { ActionItem } = require('../models/ActionItem');
const Transcript = require('../models/Transcript');
const { parseTranscript } = require('../utils/transcriptParser');
const { extractActionItemsWithGemini } = require('../utils/geminiParser');

const inferStepType = (task = '') => {
  const lowerTask = task.toLowerCase();
  if (/email|follow-up|follow up|reach out/.test(lowerTask)) return 'Follow-up';
  if (/review|check|audit/.test(lowerTask)) return 'Review';
  if (/build|develop|code|implement|fix/.test(lowerTask)) return 'Development';
  if (/doc|documentation|write up|notes|report/.test(lowerTask)) return 'Documentation';
  if (/meeting|call|sync|schedule/.test(lowerTask)) return 'Meeting';
  return 'Other';
};

const normalizeGeminiItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      const task = typeof item.task === 'string' ? item.task.trim() : '';
      if (!task) return null;

      const owner = typeof item.owner === 'string' && item.owner.trim() ? item.owner.trim() : null;
      const parsedDueDate = item.dueDate ? new Date(item.dueDate) : null;
      const dueDate = parsedDueDate && !Number.isNaN(parsedDueDate.getTime()) ? parsedDueDate : null;

      return {
        task,
        owner,
        dueDate,
        status: 'open',
        tags: [],
        stepType: inferStepType(task),
      };
    })
    .filter(Boolean);
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
        extractedCandidates = normalizeGeminiItems(geminiItems);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Gemini extraction failed. Falling back to regex parser.', error.message);
      }
    }

    if (extractedCandidates.length === 0) {
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
