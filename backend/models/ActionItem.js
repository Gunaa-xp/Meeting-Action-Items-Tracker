const mongoose = require('mongoose');

const ACTION_STATUSES = ['open', 'done'];
const STEP_TYPES = ['Follow-up', 'Review', 'Development', 'Documentation', 'Meeting', 'Other'];

const actionItemSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: String,
      default: null,
      trim: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ACTION_STATUSES,
      default: 'open',
    },
    tags: {
      type: [String],
      default: [],
    },
    stepType: {
      type: String,
      enum: STEP_TYPES,
      default: 'Other',
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = {
  ActionItem: mongoose.model('ActionItem', actionItemSchema),
  ACTION_STATUSES,
  STEP_TYPES,
};
