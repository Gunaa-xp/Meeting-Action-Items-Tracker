const { STEP_TYPES } = require('../models/ActionItem');

const splitIntoCandidates = (text) => {
  return text
    .split(/\n|\.|;|\?|!/)
    .map((segment) => stripListPrefix(segment.trim()))
    .filter(Boolean);
};

const stripListPrefix = (line) => {
  return line.replace(/^\s*(?:(?:[-*•]+|\d+[.)]|\[[ xX]\])\s+)*/, '');
};

const parseDueDate = (input) => {
  const duePatterns = [
    /\bby\s+([A-Za-z0-9\s,-]+)$/i,
    /\bdue\s+(?:on\s+)?([A-Za-z0-9\s,-]+)$/i,
    /\bbefore\s+([A-Za-z0-9\s,-]+)$/i,
  ];

  for (const pattern of duePatterns) {
    const match = input.match(pattern);
    if (!match) continue;

    const candidate = match[1].trim();
    const parsed = new Date(candidate);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
};

const parseOwner = (line) => {
  const normalizedLine = stripListPrefix(line);
  const ownerPatterns = [
    /^([A-Z][a-z]+)\s+will\b/i,
    /^([A-Z][a-z]+)\s+to\b/i,
    /assigned\s+to\s+([A-Z][a-z]+)/i,
  ];

  for (const pattern of ownerPatterns) {
    const match = normalizedLine.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
};

const inferStepType = (task) => {
  const lowerTask = task.toLowerCase();
  if (/email|follow-up|follow up|reach out/.test(lowerTask)) return 'Follow-up';
  if (/review|check|audit/.test(lowerTask)) return 'Review';
  if (/build|develop|code|implement|fix/.test(lowerTask)) return 'Development';
  if (/doc|documentation|write up|notes|report/.test(lowerTask)) return 'Documentation';
  if (/meeting|call|sync|schedule/.test(lowerTask)) return 'Meeting';
  return 'Other';
};

const cleanTask = (line) => {
  return stripListPrefix(line)
    .replace(/^([A-Z][a-z]+)\s+(will|to)\s+/i, '')
    .replace(/assigned\s+to\s+[A-Z][a-z]+/i, '')
    .replace(/\s+(by|due\s+on|due|before)\s+[A-Za-z0-9\s,-]+$/i, '')
    .trim();
};

const isActionLine = (line) => {
  const normalizedLine = stripListPrefix(line);
  const actionKeywords = /\b(will|assigned to|need to|must|should|action|todo|follow up|prepare|schedule|review|send|update|complete|finalize)\b/i;
  const ownerToPattern = /^(?:[-*•]+|\d+[.)]|\[[ xX]\])?\s*[A-Z][a-z]+\s+to\b/i;
  return actionKeywords.test(normalizedLine) || ownerToPattern.test(normalizedLine);
};

const parseTranscript = (text) => {
  const candidates = splitIntoCandidates(text);

  const parsedItems = candidates
    .filter(isActionLine)
    .map((line) => {
      const owner = parseOwner(line);
      const dueDate = parseDueDate(line);
      const task = cleanTask(line);
      const stepType = inferStepType(task);

      return {
        task,
        owner,
        dueDate,
        status: 'open',
        tags: [],
        stepType: STEP_TYPES.includes(stepType) ? stepType : 'Other',
      };
    })
    .filter((item) => item.task.length > 0);

  return parsedItems;
};

module.exports = {
  parseTranscript,
};
