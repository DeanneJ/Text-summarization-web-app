const mongoose = require('mongoose');

const summarySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    heading: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    originalWordCount: {
      type: Number,
      required: true,
    },
    summaryWordCount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;
