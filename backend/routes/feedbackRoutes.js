const express = require('express');
const router = express.Router();
const { saveFeedback, getFeedbacks,deleteFeedback } = require('../controllers/feedbackController'); // Import the controller functions

// Route to save feedback (POST request)
router.post('/add', saveFeedback);

// Route to get all feedbacks (optional, for testing)
router.get('/', getFeedbacks);

// DELETE request to delete a feedback by ID
router.delete('/delete/:id', deleteFeedback);

module.exports = router;
