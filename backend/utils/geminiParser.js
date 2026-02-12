const { GoogleGenerativeAI } = require('@google/generative-ai');

const buildPrompt = (transcript) => `Extract action items from the following meeting transcript.

Return JSON array in this format:
[
{
  task: string,
  owner: string or null,
  dueDate: string or null
}
]

Only return valid JSON. No explanation.

Transcript: ${transcript}`;

const normalizeModelItem = (item) => {
  if (!item || typeof item !== 'object') return null;

  const task = typeof item.task === 'string' ? item.task.trim() : '';
  if (!task) return null;

  const owner = typeof item.owner === 'string' && item.owner.trim() ? item.owner.trim() : null;
  const dueDate = typeof item.dueDate === 'string' && item.dueDate.trim() ? item.dueDate.trim() : null;

  return {
    task,
    owner,
    dueDate,
  };
};

const safeParseGeminiResponse = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return [];

  const cleanedText = rawText
    .replace(/```json\s*/gi, '')
    .replace(/```/g, '')
    .trim();

  try {
    const parsed = JSON.parse(cleanedText);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizeModelItem).filter(Boolean);
  } catch (_error) {
    return [];
  }
};

const extractActionItemsWithGemini = async (transcript) => {
  if (!process.env.GEMINI_API_KEY) {
    return [];
  }

  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const response = await model.generateContent(buildPrompt(transcript));
  const responseText = response.response?.text?.() || '';

  return safeParseGeminiResponse(responseText);
};

module.exports = {
  extractActionItemsWithGemini,
};
