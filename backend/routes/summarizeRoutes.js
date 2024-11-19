const express = require('express');
const router = express.Router();
const { summarizeText } = require('../utils/summarizerService'); // Import your summarization service

// POST request to summarize text
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const { heading, summary, original_word_count, summary_word_count } =
      await summarizeText(text);
    
    res.json({ heading, summary, original_word_count, summary_word_count });
  } catch (error) {
    console.error('Error summarizing text:', error);
    res.status(500).json({ error: 'Error summarizing text' });
  }
});

module.exports = router;


