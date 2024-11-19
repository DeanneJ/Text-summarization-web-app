const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Assuming you have a User model
  },
  userName: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  result: {
    type: String, // e.g., 'Positive', 'Negative'
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
