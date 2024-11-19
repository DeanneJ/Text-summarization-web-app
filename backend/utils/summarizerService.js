const axios = require('axios');

const summarizeText = async (text) => {
    try {
        const response = await axios.post('http://127.0.0.1:5001/api/summarize', { text });
        return response.data;
    } catch (error) {
        console.error('Error calling Python summarizer:', error);
        throw new Error('Error calling Python summarizer');
    }
};

module.exports = { summarizeText };






