const Feedback = require('../models/feedback'); // Import Feedback model

// @desc    Save user feedback
// @route   POST /api/feedbacks
// @access  Public (or Private based on your setup)
const saveFeedback = async (req, res) => {
  const { userId, userName, feedback, result } = req.body;

  // Validate that all fields are provided
  if (!userId || !userName || !feedback || !result) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create a new feedback entry in the database
    const newFeedback = new Feedback({
      userId,
      userName,
      feedback,
      result,
    });

    // Save feedback to the database
    const savedFeedback = await newFeedback.save();

    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Failed to save feedback' });
  }
};

// Delete a feedback by ID
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    // Find feedback by ID and delete it
    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res
      .status(200)
      .json({ message: 'Feedback deleted successfully', deletedFeedback });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting feedback', error });
  }
};

// @desc    Get all feedbacks (optional)
// @route   GET /api/feedbacks
// @access  Public (or Private based on your setup)
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error retrieving feedbacks:', error);
    res.status(500).json({ message: 'Failed to retrieve feedbacks' });
  }
};

module.exports = {
  saveFeedback,
  getFeedbacks,
  deleteFeedback
};
