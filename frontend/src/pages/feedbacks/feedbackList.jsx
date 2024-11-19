import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography } from '@material-tailwind/react';
import FeedbackCard from './feedbackCard'; // Import the FeedbackCard component

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch feedbacks from the backend
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/feedbacks');
        setFeedbacks(response.data); // Assuming response.data is the list of feedbacks
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        setError('Failed to load feedbacks');
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Function to handle deletion of feedback from state
  const handleDelete = (feedbackId) => {
    setFeedbacks(feedbacks.filter((feedback) => feedback._id !== feedbackId));
  };

  if (loading) {
    return <Typography className='text-center'>Loading feedbacks...</Typography>;
  }

  if (error) {
    return <Typography color='red' className='text-center'>{error}</Typography>;
  }

  return (
    <div className='max-w-4xl mx-auto my-10'>
      <Typography variant='h4' className='mb-6 text-center text-gray-800'>
        User Feedbacks
      </Typography>
      {feedbacks.length > 0 ? (
        feedbacks.map((feedback) => (
          <FeedbackCard
            key={feedback._id} // Assuming feedback has an `_id` field
            feedbackId={feedback._id}
            userName={feedback.userName}
            feedback={feedback.feedback}
            result={feedback.result}
            onDelete={handleDelete} // Pass the handleDelete function
          />
        ))
      ) : (
        <Typography className='text-center'>No feedbacks available</Typography>
      )}
    </div>
  );
};

export default FeedbackList;
