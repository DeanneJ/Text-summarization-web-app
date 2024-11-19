// summaryRoutes.js
const express = require('express');
const router = express.Router();
const { saveSummary, getSummariesByUser, deleteSummary } = require('../controllers/summaryController');
const { protect } = require('../middleware/authMiddleware');

// @desc    Save summary
// @route   POST /api/summaries
// @access  Private
router.post('/', saveSummary);

// @desc    Get all summaries for a particular user
// @route   GET /api/summaries/user/:userId
// @access  Private
router.get('/user/:userId', getSummariesByUser);

// @desc    Delete a summary
// @route   DELETE /api/summaries/:id
// @access  Private
router.delete('/:id', deleteSummary);

module.exports = router;
