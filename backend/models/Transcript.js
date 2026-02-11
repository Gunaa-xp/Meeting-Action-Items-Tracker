const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    extractedItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActionItem',
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('Transcript', transcriptSchema);
