const asyncHandler = require('express-async-handler');
const express = require('express');
const router = express.Router();
const Summary = require('../models/Summary');


// @desc    Save summary
// @route   POST /api/summaries
// @access  Private
const saveSummary = asyncHandler(async (req, res) => {
    const { userId, heading, summary, originalWordCount, summaryWordCount } = req.body;
  
    try {
      const newSummary = new Summary({
        user: userId,
        heading,
        summary,
        originalWordCount,
        summaryWordCount,
      });
  
      await newSummary.save();
      res.status(201).json({ message: 'Summary saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });


  // @desc    Get all summaries for a particular user
// @route   GET /api/summaries/user/:userId
// @access  Private
const getSummariesByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
        const summaries = await Summary.find({ user: userId });
        if (!summaries.length) {
            return res.status(404).json({ message: 'No summaries found for this user' });
        }
        res.status(200).json(summaries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @desc    Delete a summary
// @route   DELETE /api/summaries/:id
// @access  Private
const deleteSummary = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const summary = await Summary.findById(id);
        if (!summary) {
            return res.status(404).json({ message: 'Summary not found' });
        }

        await summary.deleteOne();
        res.status(200).json({ message: 'Summary deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


  module.exports = {saveSummary,getSummariesByUser,deleteSummary};