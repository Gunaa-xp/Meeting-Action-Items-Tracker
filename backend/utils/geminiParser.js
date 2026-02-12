const { GoogleGenerativeAI } = require('@google/generative-ai');

const MODEL_NAME = 'gemini-1.5-flash';

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

const normalizeResponseText = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
};

const extractActionItemsWithGemini = async (transcript) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !transcript || !transcript.trim()) {
    return [];
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent(buildPrompt(transcript));
    const responseText = normalizeResponseText(result.response?.text?.());

    if (!responseText) {
      return [];
    }

    const parsed = JSON.parse(responseText);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => item && typeof item.task === 'string' && item.task.trim())
      .map((item) => ({
        task: item.task.trim(),
        owner: typeof item.owner === 'string' && item.owner.trim() ? item.owner.trim() : null,
        dueDate:
          typeof item.dueDate === 'string' && item.dueDate.trim() ? item.dueDate.trim() : null,
      }));
  } catch (error) {
    console.error('Gemini extraction failed:', error.message);
    return [];
  }
};

module.exports = {
  extractActionItemsWithGemini,
};
