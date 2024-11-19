import React, { useState } from 'react';
import { Button, Textarea, Typography, Card, CardBody } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';

export function PdfSummarize() {
  const [text, setText] = useState('');
  const [heading, setHeading] = useState('');
  const [summary, setSummary] = useState('');
  const [originalWordCount, setOriginalWordCount] = useState(0);
  const [summaryWordCount, setSummaryWordCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);  // State for the PDF file

  const { userInfo } = useSelector((state) => state.auth);

  const userId = userInfo ? userInfo._id : '';

  // Function to copy text to clipboard
  const handleCopyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      toast.success('Summary copied to clipboard!');
    }
  };

  // Handle Summarize request for text input
  const handleSummarize = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/summarize', {
        text,
      });
      const { heading, summary, original_word_count, summary_word_count } = response.data;
      setHeading(heading);
      setSummary(summary);
      setOriginalWordCount(original_word_count);
      setSummaryWordCount(summary_word_count);
    } catch (error) {
      console.error('Error summarizing text:', error);
    }
  };

  // Handle PDF file change
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle PDF summarization
  const handleSummarizePDF = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const response = await axios.post('http://localhost:5001/api/summarize-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { heading, summary, original_word_count, summary_word_count } = response.data;
      setHeading(heading);
      setSummary(summary);
      setOriginalWordCount(original_word_count);
      setSummaryWordCount(summary_word_count);
    } catch (error) {
      console.error('Error summarizing PDF:', error);
    }
  };

  // Handle Save Summary request
  const handleSaveSummary = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/summaries', {
        userId, // Pass the user's ID
        heading,
        summary,
        originalWordCount,
        summaryWordCount,
      });
      if (response.status === 201) {
        toast.success('Summary saved successfully!');
      }
    } catch (error) {
      console.error('Error saving summary:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-50">
      <Card className="w-full bg-white shadow-lg max-w-7xl mt-[-120px]">
        <CardBody className="p-10">
          <Typography variant="h4" className="mb-8 text-center text-gray-800">
            Summarize Your PDF
          </Typography>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {/* Input Text Area */}
            <div>
              {/* <Textarea
                label="Enter the text you want to summarize"
                className="h-[300px] rounded-lg border-gray-300"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Button className="w-full mt-4 text-white bg-gray-800 hover:bg-gray-900" onClick={handleSummarize}>
                Summarize Text
              </Button> */}

              {/* PDF File Upload */}
              <div className="mt-6">
                <input type="file" accept="application/pdf" onChange={handleFileChange} />
                <Button className="w-full mt-4 text-white bg-blue-800 hover:bg-blue-900" onClick={handleSummarizePDF}>
                  Summarize PDF
                </Button>
              </div>
            </div>

            {/* Output Summary Area */}
            <div>
              <Textarea
                label="Summary"
                className="h-[350px] rounded-lg border-gray-300"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                readOnly
              />
              <Button className="w-full mt-4 text-white bg-green-600 hover:bg-green-700" onClick={handleCopyToClipboard}>
                Copy to Clipboard
              </Button>
              <Button className="w-full mt-4 text-white bg-teal-600 hover:bg-teal-700" onClick={handleSaveSummary}>
                Save Summary
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
