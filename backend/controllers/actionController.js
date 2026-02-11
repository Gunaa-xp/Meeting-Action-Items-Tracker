const { ActionItem, STEP_TYPES } = require('../models/ActionItem');

const normalizeTags = (tags) => {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => String(tag).trim())
    .filter(Boolean);
};

const getActions = async (req, res, next) => {
  try {
    const { status, stepType, tag } = req.query;
    const filter = {};

    if (status && ['open', 'done'].includes(status)) {
      filter.status = status;
    }

    if (stepType && STEP_TYPES.includes(stepType)) {
      filter.stepType = stepType;
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    const actions = await ActionItem.find(filter).sort({ createdAt: -1 });
    res.json(actions);
  } catch (error) {
    next(error);
  }
};

const createAction = async (req, res, next) => {
  try {
    const { task, owner, dueDate, status, tags, stepType } = req.body;
    const created = await ActionItem.create({
      task,
      owner: owner || null,
      dueDate: dueDate || null,
      status: status || 'open',
      tags: normalizeTags(tags),
      stepType: STEP_TYPES.includes(stepType) ? stepType : 'Other',
    });

    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

const updateAction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatePayload = { ...req.body };

    if ('tags' in updatePayload) {
      updatePayload.tags = normalizeTags(updatePayload.tags);
    }

    if ('stepType' in updatePayload && !STEP_TYPES.includes(updatePayload.stepType)) {
      updatePayload.stepType = 'Other';
    }

    const updated = await ActionItem.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Action item not found.' });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteAction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await ActionItem.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Action item not found.' });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActions,
  createAction,
  updateAction,
  deleteAction,
};
