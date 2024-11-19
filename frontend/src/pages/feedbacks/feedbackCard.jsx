import React from 'react';
import { Card, Typography, Button } from '@material-tailwind/react';
import axios from 'axios';
import { toast } from 'react-toastify';

// A function to determine the background color based on feedback result
const getResultColor = result => {
  return result === 'positive' ? 'bg-green-50' : 'bg-red-50';
};

// A function to determine the text color for the result indicator
const getResultTextColor = result => {
  return result === 'positive' ? 'text-green-500' : 'text-red-500';
};

const FeedbackCard = ({ feedbackId, userName, feedback, result, onDelete }) => {
  // Function to handle feedback deletion
  const handleDeleteFeedback = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/feedbacks/delete/${feedbackId}`
      );
      toast.success('Feedback deleted successfully!');
      onDelete(feedbackId); // Update parent component state after deletion
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback');
    }
  };

  return (
    <Card className={`p-6 mb-4 shadow-md ${getResultColor(result)}`}>
      <div className='flex items-center justify-between'>
        <div>
          <Typography variant='h5' className='text-gray-800'>
            {userName}
          </Typography>
          <Typography variant='h6' className='my-4 text-gray-700'>
            {feedback}
          </Typography>
          <Typography
            variant='small'
            className={`font-bold ${getResultTextColor(result)}`}
          >
            {result === 'positive'
              ? '😊 Positive Feedback'
              : '😞 Negative Feedback'}
          </Typography>
        </div>

        {/* Delete Button */}
        <Button
          variant='text'
          color='red'
          onClick={handleDeleteFeedback}
          className='ml-4'
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default FeedbackCard;
