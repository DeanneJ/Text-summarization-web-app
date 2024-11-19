import {
  Button,
  Textarea,
  Typography,
  Card,
  CardBody,
} from '@material-tailwind/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';

export function Summarize() {
  const [text, setText] = useState('');
  const [heading, setHeading] = useState('');
  const [summary, setSummary] = useState('');
  const [originalWordCount, setOriginalWordCount] = useState(0);
  const [summaryWordCount, setSummaryWordCount] = useState(0);
  const [feedback, setFeedback] = useState(''); // New state for feedback
  const [feedbackResult, setFeedbackResult] = useState('');

  const { userInfo } = useSelector(state => state.auth);

  const userId = userInfo ? userInfo._id : '';
  const userName = userInfo ? userInfo.name : '';

  // Function to copy text to clipboard
  const handleCopyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      toast.success('Summary copied to clipboard!');
    }
  };

  // Handle Summarize request
  const handleSummarize = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/summarize', {
        text,
      });
      const { heading, summary, original_word_count, summary_word_count } =
        response.data;
      setHeading(heading);
      setSummary(summary);
      setOriginalWordCount(original_word_count);
      setSummaryWordCount(summary_word_count);
    } catch (error) {
      console.error('Error summarizing text:', error);
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

  // Handle Submit Feedback request
  // const handleFeedbackSubmit = async () => {
  //   try {
  //     if (!feedback) {
  //       toast.error('Please enter your feedback');
  //       return;
  //     }
      
  //     const response = await axios.post('http://localhost:5001/api/feedback', {
  //       feedback,
  //     });
      
  //     setFeedbackResult(response.data.result); // Assuming response returns sentiment (e.g., 'Positive' or 'Negative')
  //     toast.success('Feedback submitted successfully!');
  //   } catch (error) {
  //     console.error('Error submitting feedback:', error);
  //     toast.error('Failed to submit feedback');
  //   }
  // };

  const handleFeedbackSubmit = async () => {
    try {
      if (!feedback) {
        toast.error('Please enter your feedback');
        return;
      }

      // First request: Submit feedback for sentiment analysis
      const response = await axios.post('http://localhost:5001/api/feedback', {
        feedback,
      });

      const result = response.data.result; // Assuming response returns sentiment (e.g., 'Positive' or 'Negative')
      setFeedbackResult(result);
      toast.success('Feedback submitted successfully!');

      // Second request: Save feedback details to the backend
      await axios.post('http://localhost:5000/api/feedbacks/add', {
        userId,
        userName, // Save the username
        feedback,
        result, // Save the feedback result
      });
      toast.success('Feedback saved successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-10 bg-gray-50'>
      <Card className='w-full bg-white shadow-lg max-w-7xl mt-[-120px]'>
        <CardBody className='p-10'>
          <Typography variant='h4' className='mb-8 text-center text-gray-800'>
            Summarize Your Text
          </Typography>

          <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
            {/* Input Text Area */}
            <div>
              <Textarea
                label='Enter the text you want to summarize'
                className='h-[350px] rounded-lg border-gray-300 '
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <Button
                className='w-full mt-4 text-white bg-gray-800 hover:bg-gray-900'
                onClick={handleSummarize}
              >
                Summarize
              </Button>
            </div>

            {/* Output Summary Area */}
            <div>
              <Textarea
                label='Summary'
                className='h-[350px] rounded-lg border-gray-300'
                value={summary}
                onChange={e => setSummary(e.target.value)}
              />

              {userInfo ? (
                <div className='flex items-center justify-between mt-4'>
                  <Button
                    className='mr-4 text-white bg-green-600 hover:bg-green-700'
                    onClick={handleSaveSummary}
                  >
                    Save Summary
                  </Button>
                  <Button
                    className='text-white bg-gray-600 hover:bg-gray-700'
                    onClick={handleCopyToClipboard}
                  >
                    Copy to Clipboard
                  </Button>
                </div>
              ) : (
                <Typography
                  variant='subtitle2'
                  color='red'
                  className='mt-4 text-center'
                >
                  Please log in to save your summaries.
                </Typography>
              )}
            </div>
          </div>

          {/* Summary Details */}
          {heading && (
            <div className='mt-10 text-center'>
              <h2 className='mb-4 text-xl font-bold text-gray-800'>
                Heading: {heading}
              </h2>
              <p className='text-gray-600'>
                <strong>Original Word Count:</strong> {originalWordCount}
              </p>
              <p className='text-gray-600'>
                <strong>Summary Word Count:</strong> {summaryWordCount}
              </p>
            </div>
          )}

          {/* Conditional Feedback Form */}
          {userInfo && (
            <div className='mt-16'>
              <Typography
                variant='h5'
                className='mb-6 text-center text-gray-800'
              >
                Give Your Feedback on the Summary
              </Typography>
              <Card className='p-6 bg-white shadow-md'>
                <Textarea
                  label='Enter your feedback here'
                  className='h-[150px] mb-4 rounded-lg border-gray-300'
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                />
                <div className='flex justify-center'>
                  <Button
                    className='text-white bg-blue-600 hover:bg-blue-700'
                    onClick={handleFeedbackSubmit}
                  >
                    Submit Feedback
                  </Button>
                </div>
                {feedbackResult && (
                  <Typography
                    variant='h6'
                    className='mt-6 text-center text-gray-700'
                  >
                    Your feedback is classified as:{' '}
                    <strong>{feedbackResult}</strong>
                  </Typography>
                )}
              </Card>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
